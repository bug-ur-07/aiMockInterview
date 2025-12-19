import { NextRequest } from "next/server";
export const runtime = "nodejs"; // important for FormData support

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const audioFile = form.get("audio") as File;

    if (!audioFile || audioFile.size < 3000) {
      return Response.json({ transcript: "", message: "No speech detected" });
    }

    console.log(
      "Received audio file:----------------------------",
      audioFile.name,
      audioFile.type,
      audioFile.size
    );

    const arrayBuffer = await audioFile.arrayBuffer();

    const STT_RESPONSE = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2-general",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": audioFile.type,
        },
        body: arrayBuffer,
      }
    );

    if (!STT_RESPONSE.ok) {
      const response = await STT_RESPONSE.text();
      console.error("response error ---------------------------", response);

      return Response.json(
        {
          transcript: "",
          error: STT_RESPONSE.statusText,
        },
        { status: 500 }
      );
    }

    const result = await STT_RESPONSE.json();
    const text = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    console.log("Transcription result:", text);
    return Response.json({ transcript: text });
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, { status: 500 });
  }
}
