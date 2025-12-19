"use client";

import { useCallback, useEffect } from "react";

type ttsProps = {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  onAudioReady?: (audio: HTMLAudioElement) => void; // <-- ADD THIS
};

export default function TTSSpeak({
  text,
  onStart,
  onEnd,
  onAudioReady,
}: ttsProps) {
  useEffect(() => {
    if (!text) return;
    const speak = async () => {
      const RESPONSE = await fetch("/api/speech_convertor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!RESPONSE.ok) {
        console.error("TTS Error");
        return;
      }
      const url = URL.createObjectURL(await RESPONSE.blob());
      const audio = new Audio(url);
      onAudioReady?.(audio);
      audio.onplay = () => onStart?.();
      audio.onended = () => onEnd?.();
      audio.play().catch((err) => {
        console.log(err, "error of audio");
      });
    };
    speak();
  }, [text]);

  return null;
}
