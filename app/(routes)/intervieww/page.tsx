"use client";
import VideoCall from "../_components/VideoCall";
import TTSSpeak from "../tts/text_to_speech";
import SttResponse from "../stt/speech_to_text";
import { useState, useEffect, useCallback } from "react";
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
  const [transition, setTransition] = useState("");
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
      var arr;
      if (text.length > 11) {
        arr = [
          "That’s a good answer. Let’s move on to the next question.",
          "Thanks for explaining that. Now we’ll continue with the next one.",
          "Nice response. Let’s go ahead and move to the next question.",
          "Great, thank you for your answer. Let’s proceed to the next one.",
          "That sounds good. We’ll now move forward to the next question.",
          "Alright, I got your answer. Let’s continue with the next question.",
          "Thanks for sharing that. Let’s move on to the next part.",
          "Good explanation. Now let’s continue with the next question.",
          "That was helpful. Let’s move ahead to the next one.",
          "Nice, thanks for answering. Let’s go to the next question.",
        ];
        const index = Math.floor(Math.random() * arr.length);
        setTransition(arr[index]);
      }

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
      router.push("/");
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
          flexDirection: "column",
          gap: 100,
        }}
      >
        <div>
          <TTSSpeak
            text={transition || current_question}
            onStart={() => {
              console.log("TTS started");
              stopRecording();
            }}
            onEnd={() => {
              console.log("TTS finished → starting STT");
              if (transition) {
                setTransition("");
              } else {
                setTimeout(() => {
                  startRecording();
                }, 800);
              }
            }}
            onAudioReady={(audio: HTMLAudioElement) => setAudioElement(audio)}
          />
          <WaveVisualizer audio={audioElement} />
        </div>
        <div
          style={{
            cursor: "pointer",
            backgroundColor: "red",
            padding: "10px",
            borderRadius: "12px",
          }}
        >
          <button
            style={{
              cursor: "inherit",
            }}
            onClick={() => {
              router.push("/");
            }}
          >
            End the Interview
          </button>
        </div>
      </div>
    </main>
  );
}
