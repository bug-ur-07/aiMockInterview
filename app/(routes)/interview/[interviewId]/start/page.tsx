"use client";

import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { startSpeechToText } from "@/lib/speech";
import DidAvatar from "./DidAvatar";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

interface Q {
  question: string;
  question_number: number;
}

export default function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();

  const [questions, setQuestions] = useState<Q[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);

  const [ttsAudioUrl, setTtsAudioUrl] = useState(""); // <-- ❤️ FIXED

  useEffect(() => {
    loadQuestions();
  }, []);

  /** Fetch questions */
  const loadQuestions = async () => {
    const data = await convex.query(api.Interview.GetInterviewQuestions, {
      interviewRecordsId: interviewId as Id<"InterviewSessionTable">,
    });

    setQuestions(data.interviewQuestions);

    // Generate TTS for first question
    generateAudio(data.interviewQuestions[0].question);
  };

  /** Generate audio for the AI avatar */
  const generateAudio = async (text: string) => {
    try {
      const speech = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
      });

      const base64 = Buffer.from(await speech.arrayBuffer()).toString("base64");

      const url = `data:audio/mp3;base64,${base64}`;

      setTtsAudioUrl(url); // <-- 🎉 NOW avatar will play audio
    } catch (error) {
      console.log("TTS error:", error);
    }
  };

  /** Start recording user answer */
  const startVoiceAnswer = async () => {
    try {
      setRecording(true);
      const text = await startSpeechToText();
      setRecording(false);
      setAnswer(text);
    } catch (err) {
      console.log("Speech error:", err);
      setRecording(false);
    }
  };

  /** Move to next question */
  const nextQuestion = () => {
    const next = currentIndex + 1;

    if (next >= questions.length) {
      alert("Interview finished!");
      return;
    }

    setCurrentIndex(next);
    setAnswer("");

    // Regenerate audio for next question
    generateAudio(questions[next].question);
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Interview Start</h1>

      <p className="mt-4 text-lg">{questions[currentIndex].question}</p>

      <DidAvatar
        text={questions[currentIndex].question}
        audioUrl={ttsAudioUrl}
      />

      <textarea
        className="border p-3 w-full mt-3 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={startVoiceAnswer}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🎤 {recording ? "Listening..." : "Speak Answer"}
        </button>

        <button
          onClick={nextQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
