"use client";

import { useState, useRef } from "react";

export default function DidAvatar({ text }: { text: string }) {
  const [status, setStatus] = useState("Ready");
  const [speaking, setSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Update Speech Bubble ---
  const setBubbleText = (msg: string) => {
    const el = document.getElementById("speech-text");
    if (el) el.innerText = msg;
  };

  // --- Play Audio From Your Web Speech API / OpenAI TTS ---
  const playVoice = async (audioUrl: string) => {
    setSpeaking(true);
    setStatus("Speaking...");

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      await audioRef.current.play();

      audioRef.current.onended = () => {
        setSpeaking(false);
        setStatus("Ready");
      };
    }
  };

  // Fake demo button (You will replace with your audio URL)
  const demoSpeak = () => {
    setBubbleText(text);
    playVoice("/dummy.mp3"); // replace with your TTS output
  };

  return (
    <>
      {/* INTERNAL CSS */}
      <style>{`
        .avatar-container {
          width: 260px;
          margin-top: 15px;
          padding: 15px;
          border-radius: 14px;
          background: #1a1a1a;
          border: 1px solid #333;
          text-align: center;
          color: white;
        }

        .avatar-frame {
          width: 160px;
          height: 160px;
          margin: auto;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          border: 3px solid #4f46e5;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Mouth animation while speaking */
        .mouth {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 12px;
          background: #ff4d6d;
          border-radius: 50px;
          opacity: 0;
          transition: 0.2s;
        }

        .speaking .mouth {
          opacity: 1;
          animation: talk 0.25s infinite alternate;
        }

        @keyframes talk {
          0% { height: 6px; }
          100% { height: 18px; }
        }

        .speech-bubble {
          margin-top: 12px;
          background: #333;
          padding: 10px;
          border-radius: 12px;
          font-size: 14px;
          border: 1px solid #4f46e5;
        }

        .btn {
          margin-top: 10px;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-stop {
          background: #dc2626;
          color: white;
          margin-left: 8px;
        }
      `}</style>

      <div className={`avatar-container ${speaking ? "speaking" : ""}`}>
        <div className="avatar-frame">
          <img
            className="avatar-img"
            src="/avatar-placeholder.jpg"
            alt="AI Avatar"
          />
          <div className="mouth"></div>
        </div>

        <div className="speech-bubble">
          <span id="speech-text">Hi! I’m your AI interviewer.</span>
        </div>

        <button className="btn btn-primary" onClick={demoSpeak}>
          🔊 Speak Text
        </button>

        {speaking && (
          <button
            className="btn btn-stop"
            onClick={() => {
              setSpeaking(false);
              if (audioRef.current) audioRef.current.pause();
            }}
          >
            ⏹ Stop
          </button>
        )}

        <audio ref={audioRef}></audio>

        <p style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>
          Status: {status}
        </p>
      </div>
    </>
  );
}
