import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";
import os from "os";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const CLIENT = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // *******************READ FORM DATA *******************
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    console.log("Received file: *********STEP 1 EXECUTE", file?.type);

    // *******************BUFFER THE PDF FILE *******************
    const buffer = Buffer.from(await file.arrayBuffer());
    const temdir = os.tmpdir();

    const tempFileName = `${uuid()}.pdf`;
    const tempPath = `${temdir}/${tempFileName}`;

    await fs.writeFile(tempPath, buffer);
    console.log(
      "📄 PDF temporarily saved: *********STEP 2 EXECUTE"
      //  tempPath
    );

    // ******************* STEP 3: GET PRESIGNED URL FROM PDF.CO *******************
    const presignedRes = await fetch(
      `https://api.pdf.co/v1/file/upload/get-presigned-url?contenttype=application/pdf&name=${tempFileName}`,
      {
        headers: {
          "x-api-key":
            "amandhn5973@gmail.com_JoVru5cMASC76VuUUBPDtp5SQ65GgcaubFyzq43vhuSXu4I2W0UkvVboxthE49go",
        },
      }
    );
    const presignedJson = await presignedRes.json();
    console.log(
      "Presigned URL response: *********STEP 3 EXECUTE"
      // presignedJson
    );
    if (presignedJson.error) {
      console.log(
        "Error getting presigned URL:",
        presignedJson.message,
        "error ",
        presignedJson
      );
    }

    const uploadUrl = presignedJson.presignedUrl; // used to upload
    const uploadedFileUrl = presignedJson.url;

    console.log(
      "📤 PDF.co Upload URL:"
      // uploadUrl
    );

    // ******************* STEP 4: UPLOAD THE PDF TO PDF.CO *******************

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: buffer,
    });

    if (!uploadRes.ok) {
      return NextResponse.json(
        { error: "Failed to upload to PDF.co" },
        { status: 500 }
      );
    }

    console.log(
      "✅ File uploaded to PDF.co cloud step 4 EXECUTE"
      // uploadRes
    );

    // ******************* STEP 5: CONVERT PDF --> TO JSON *******************
    const convertRes = await fetch(
      "https://api.pdf.co/v1/pdf/convert/to/json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "amandhn5973@gmail.com_JoVru5cMASC76VuUUBPDtp5SQ65GgcaubFyzq43vhuSXu4I2W0UkvVboxthE49go",
        },
        body: JSON.stringify({
          url: uploadedFileUrl,
          name: "result.json",
          pages: "", // all pages
        }),
      }
    );

    const convertJson = await convertRes.json();
    console.log(
      "PDF to JSON conversion response: *********STEP 5 EXECUTE"
      // convertJson.url
    );

    if (convertJson.error) {
      console.log(
        "Error converting PDF to JSON:",
        convertJson.message,
        "error ",
        convertJson
      );
    }

    // ******************* STEP 6: FETCH THE CONVERTED JSON FILE *******************
    const jsonFileResponse = await fetch(convertJson.url);
    const pdfJson = await jsonFileResponse.json();

    console.log("📥 Converted JSON fetched: *********STEP 6 EXECUTE", pdfJson);

    const rows = pdfJson?.document?.page?.row || [];
    console.log("Extracted rows from JSON: ", rows);

    let extractedText = "";

    for (const row of rows) {
      const columns = row.column || [];

      for (const col of columns) {
        // PDF.co stores text inside col.text["#text"]
        const textObj = col?.text?.["#text"];

        if (typeof textObj === "string") {
          extractedText += textObj + " ";
        }
      }
    }

    console.log("Extracted Text: *********FINAL OUTPUT", extractedText);

    const GENERATED_QUESTION = await CLIENT.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You generate interview questions for candidates.",
        },
        {
          role: "user",
          content: `Here is my resume ${extractedText}  Generate:- 4 basic questions - 4 intermediate questions - 2 hard questions and return in singel json boject format like this[ { "question": "..." }]`,
        },
      ],
    });

    const GENERATED_QUESTION_RESULT =
      GENERATED_QUESTION.choices[0].message?.content;
    console.log("Generated Interview Questions: ", GENERATED_QUESTION_RESULT);

    return NextResponse.json({
      success: true,
      message: "Interview questions generated successfully",
      data: extractedText,
      questions: GENERATED_QUESTION_RESULT,
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing PDF",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
