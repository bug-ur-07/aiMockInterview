"use client";
import VideoCall from "../_components/VideoCall";
import TTSSpeak from "../tts/text_to_speech";
import SttResponse from "../stt/speech_to_text";
import { useState, useEffect } from "react";
import WaveVisualizer from "../_components/WaveVisualizer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const current_question = questions[index] || "interview completed";

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [transcript, setTranscript] = useState("");
  const searchParams = useSearchParams();
  const raw = searchParams.get("pageData");

  useEffect(() => {
    if (!raw) return;

    try {
      const pageData = JSON.parse(raw); // Parse full page data
      const arr = JSON.parse(pageData.questions); // Parse JSON-string
      const extracted = arr.map((q: any) => q.question); // Extract text only
      console.log("Loaded questions:", extracted);
      setQuestions(extracted);
    } catch (e) {
      console.error("Error parsing questions:", e);
    }
  }, [raw]);

  const { startRecording, stopRecording } = SttResponse({
    onTranscript: (text: string) => {
      console.log("Final Transcript:", text);
      setTranscript(text);

      setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 800);
    },

    onStop: () => {
      console.log("STT stopped (manual or silence)");
    },
  });
  useEffect(() => {
    if (questions.length === 0) return;
    if (index >= questions.length) {
      router.push("/dashboard");
    }
  }, [index, questions.length, router]);

  if (!ready) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>AI Interview</h1>
        <p>Click the button below to start.</p>
        <button
          onClick={() => setReady(true)}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            borderRadius: "8px",
            background: "#6a5acd",
            color: "#fff",
          }}
        >
          Start Interview
        </button>
      </div>
    );
  }
  return (
    <main
      style={{ display: "flex", padding: 0, width: "100%", height: "100vh" }}
    >
      <div style={{ width: "70%", borderRight: "2px solid #eee" }}>
        <VideoCall />
      </div>
      <div
        style={{
          width: "30%",
          padding: 40,
          background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <TTSSpeak
            text={current_question}
            onStart={() => {
              console.log("TTS started");
              stopRecording();
            }}
            onEnd={() => {
              console.log("TTS finished → starting STT");
              setTimeout(() => {
                startRecording();
              }, 1000);
            }}
            onAudioReady={(audio: HTMLAudioElement) => setAudioElement(audio)}
          />
          <WaveVisualizer audio={audioElement} />
        </div>
      </div>
    </main>
  );
}
