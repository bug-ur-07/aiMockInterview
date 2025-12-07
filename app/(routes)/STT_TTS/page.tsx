"use client";
// import { audio } from "motion/react-client";
import { useState, useRef } from "react";
export default function Page() {
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const TTS = async () => {
    const START = performance.now();
    const RESPONSE = await fetch("/api/speech_convertor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: question }),
    });
    const END = performance.now();
    console.log("latencey : ", END - START, "ms");
    console.log(
      "latencey from back-end : ",
      RESPONSE.headers.get("X-latencey")
    );

    if (!RESPONSE.ok) {
      console.error("TTS API error:", RESPONSE.statusText);
      return;
    }

    const audioUrl = URL.createObjectURL(await RESPONSE.blob());
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // ****************************** SPEECH TO TEXT ******************************

  const STT = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    chunksRef.current = [];
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = async (event) => {
      chunksRef.current.push(event.data);
    };
    mediaRecorder.start();
  };
  const STOP_STT = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, {
        type: "audio/webm;codecs=opus",
      });

      console.log("Audio Blob :", audioBlob);

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const RESPONSE = await fetch("/api/text_convertor", {
        method: "POST",
        body: formData,
      });

      if (!RESPONSE.ok) {
        console.log("response error from STT API", RESPONSE.statusText);
      }
      const data = await RESPONSE.json();
      console.log("TRANSCRIPT:", data);
    };
  };
  return (
    <header style={{ padding: "40px" }}>
      {/* Main Container */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "30px",
          borderRadius: "12px",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
          AI Mock Interview Panel
        </h1>

        {/* Question Box */}
        <div style={{ marginBottom: "25px" }}>
          <h3>Enter Your Question:</h3>
          <textarea
            placeholder="Write your interview question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Speak & Pause Buttons */}
        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={TTS}
            style={{
              padding: "12px 20px",
              marginRight: "10px",
              background: "#6a5acd",
              color: "white",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            Speak Question
          </button>
        </div>

        {/* STT Section */}
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            background: "#f5f5f5",
            marginBottom: "20px",
          }}
        >
          <h3>Speech to Text (Your Answer):</h3>

          <button
            onClick={STT}
            style={{
              padding: "12px",
              marginRight: "10px",
              background: "#4caf50",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Start STT
          </button>

          <button
            onClick={STOP_STT}
            style={{
              padding: "12px",
              background: "red",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Stop STT
          </button>

          <h3 style={{ marginTop: "20px" }}>Transcript:</h3>
          <p style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
            {transcript}
          </p>
        </div>
      </div>
    </header>
  );
}
