import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const start = performance.now();

    const { text } = await req.json();
    console.log("TTS request received with text:", text);

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
      });
    }

    // ******************* CALLING DEEPGRAM TTS SERVICE *******************
    const TTS_RESPONSE = await fetch(
      "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!TTS_RESPONSE.ok) {
      throw new Error(
        `Deepgram TTS API error: ${TTS_RESPONSE.status} ${TTS_RESPONSE.statusText}`
      );
    }

    const arrayBuffer = await TTS_RESPONSE.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const end = performance.now();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "X-latencey": `${end - start} ms`,
      },
    });
  } catch (err: any) {
    console.error("Error in TTS route:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
