"use client";

import { useEffect, useRef, useState } from "react";

export default function DidAvatar({ audioUrl, text }: { audioUrl: string; text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // When parent sends a new audio URL → play automatically
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    const audio = audioRef.current;

    audio.src = audioUrl;

    audio.onplay = () => {
      setSpeaking(true);
    };

    audio.onended = () => {
      setSpeaking(false);
    };

    audio.onerror = () => {
      setSpeaking(false);
    };

    audio.play();
  }, [audioUrl]);

  return (
    <>
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
          animation: talk 0.2s infinite alternate;
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
          <span>{text}</span>
        </div>

        <audio ref={audioRef} />
      </div>
    </>
  );
}
