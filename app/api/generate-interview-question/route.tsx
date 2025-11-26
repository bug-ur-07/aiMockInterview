export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { aj } from "@/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type. Must be multipart/form-data." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = formData.get("jobTitle") as string
    const jobDescription = formData.get("jobDescription") as string

    const decision = await aj.protect(req, { userId:user?.primaryEmailAddress?.emailAddress??"", requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);
    
    //@ts-ignore
    if(decision?.reason?.remaining==0){
      return NextResponse.json({
        status:429,
        result:'No Free credit remaining, Try again after some time'
      })
    }
    if(file){

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `upload-${Date.now()}.pdf`,
      useUniqueFileName: true,
    });

    console.log("✅ Upload successful:", uploadResponse.url);

    // 🔗 Call n8n webhook
    const result = await axios.post("http://localhost:5678/webhook/generate-interview-question", {
      resumeUrl: uploadResponse?.url,
    });

    // ✅ Extract only the questions from the webhook response
    const questions =
      result.data?.output?.[0]?.content?.[0]?.text?.questions || [];


    // Return full JSON if needed by frontend
    return NextResponse.json({ questions,resumeUrl:uploadResponse?.url }, { status: 200 });
  } 
  else{
    console.log("🧠 Sending to n8n without resume...");
    const result = await axios.post("http://localhost:5678/webhook/generate-interview-question", {
    resumeUrl: null,
    "Job Title": jobTitle,
    "Job DesDescription": jobDescription,
  });

       const questions =
    result.data?.questions || 
    result.data?.output?.[0]?.content?.[0]?.text?.questions || [];

  console.log("✅ Questions received:", questions);

    // Return full JSON if needed by frontend
    return NextResponse.json({ questions,resumeUrl:null }, { status: 200 }); 
  }
  }
  catch (error: any) {
    console.error("❌ ImageKit upload error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

