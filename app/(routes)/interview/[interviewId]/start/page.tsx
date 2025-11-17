"use client";

import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { startSpeechToText } from "@/lib/speech";
import DidAvatar from "./DidAvatar";

interface Q {
  question: string;
  question_number: number;
}

const speak = (text: string) => {
  if (!window.speechSynthesis) {
    console.log("Speech Synthesis not supported");
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 1;
  utter.pitch = 1;

  utter.onerror = (err) => console.log("Speech error:", err);

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
};


export default function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();

  const [questions, setQuestions] = useState<Q[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await convex.query(api.Interview.GetInterviewQuestions, {
      interviewRecordsId: interviewId as Id<"InterviewSessionTable">,
    });

    setQuestions(data.interviewQuestions);

    speak(data.interviewQuestions[0].question);
  };

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

  const nextQuestion = () => {
    const next = currentIndex + 1;

    if (next >= questions.length) {
      alert("Interview done!");
      return;
    }

    setCurrentIndex(next);
    setAnswer("");

    speak(questions[next].question);
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Interview Start</h1>

      <p className="mt-4 text-lg">{questions[currentIndex].question}</p>
      <DidAvatar text={questions[currentIndex].question} />

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
