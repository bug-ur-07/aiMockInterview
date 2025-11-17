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

const speak = (text: string, onEnd: () => void) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 1;
  utter.pitch = 1;
  utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
};

export default function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();

  const [questions, setQuestions] = useState<Q[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);

  const [aiSpeaking, setAiSpeaking] = useState(true);  // disable buttons
  const [answered, setAnswered] = useState(false);      // user answered or not

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await convex.query(api.Interview.GetInterviewQuestions, {
      interviewRecordsId: interviewId as Id<"InterviewSessionTable">,
    });

    setQuestions(data.interviewQuestions);

    // AI starts speaking
    speak(data.interviewQuestions[0].question, () => {
      setAiSpeaking(false); // AI finished → user can speak now
    });
  };

  const startVoiceAnswer = async () => {
    if (answered || aiSpeaking) return;

    try {
      setRecording(true);
      const text = await startSpeechToText();
      setRecording(false);

      setAnswer(text);
      setAnswered(true); // user cannot speak again
    } catch (err) {
      console.log("Speech error:", err);
      setRecording(false);
    }
  };

  const nextQuestion = () => {
    if (!answered) return;

    const next = currentIndex + 1;

    if (next >= questions.length) {
      alert("Interview complete!");
      return;
    }

    setCurrentIndex(next);
    setAnswer("");
    setAnswered(false);
    setAiSpeaking(true);

    speak(questions[next].question, () => {
      setAiSpeaking(false); // AI finished speaking
    });
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="min-h-screen pt-20 pb-10 bg-white flex flex-col items-center">
      <h1 className="text-xl font-bold mb-6">Interview Start</h1>

      <div className="flex w-full max-w-5xl justify-between items-start">

        {/* LEFT: AI AVATAR */}
        {/* <DidAvatar text={questions[currentIndex].question} /> */}
<div className="rounded-2xl shadow-lg bg-white border border-gray-200 p-6 w-80">
  <DidAvatar 
    text={questions[currentIndex].question}
    onDone={() => setAiSpeaking(false)}
  />
</div>



        {/* RIGHT: USER CARD */}
        {/* RIGHT: USER CARD */}
        <div className="rounded-2xl shadow-lg bg-white border border-gray-200 p-6 w-80">
  


<div className="w-72 h-72 flex flex-col items-center justify-center bg-[#0d0d0d] border border-[#252525] rounded-2xl text-white shadow-lg p-4">

  {/* Waiting text */}
  {!answered && !recording && (
    <p className="text-gray-500">Waiting for your answer...</p>
  )}

  {/* Recording animation */}
  {recording && (
    <div className="flex flex-col items-center">
      <p className="text-gray-300 mb-3">You are speaking...</p>
      <div className="flex gap-1">
        <div className="w-2 h-5 bg-blue-400 animate-bounce"></div>
        <div className="w-2 h-8 bg-purple-400 animate-bounce delay-100"></div>
        <div className="w-2 h-4 bg-cyan-400 animate-bounce delay-200"></div>
        <div className="w-2 h-7 bg-pink-400 animate-bounce delay-300"></div>
      </div>
    </div>
  )}

  {/* ANSWER TEXTAREA */}
  {answered && !recording && (
    <textarea
      value={answer}
      readOnly
      className="
        w-full 
        h-full 
        resize-none 
        bg-transparent 
        text-gray-200 
        border border-[#333] 
        rounded-lg 
        p-3 
        outline-none 
        overflow-y-auto
        scrollbar-thin 
        scrollbar-thumb-gray-600 
        scrollbar-track-transparent
      "
    />
  )}
</div>
</div>
      </div>

      {/* CENTERED BUTTONS */}
     <div className="flex gap-5 mt-10 justify-center">

  <button
    onClick={startVoiceAnswer}
    disabled={aiSpeaking || answered}
    className={`px-6 py-3 rounded-xl text-lg font-medium transition
      ${aiSpeaking || answered
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-green-600 text-white shadow-md hover:bg-green-700"
      }`}
  >
    🎤 Speak Answer
  </button>

  <button
    onClick={nextQuestion}
    disabled={!answered}
    className={`px-6 py-3 rounded-xl text-lg font-medium transition
      ${!answered
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
      }`}
  >
    Next →
  </button>
<button
  onClick={() => window.location.href = "/dashboard"}
  className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2"
>
  ⛔ End Call
</button>

</div>

    </div>
  );
}
