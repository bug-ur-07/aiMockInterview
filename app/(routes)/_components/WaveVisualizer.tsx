"use client";

import { useEffect, useRef } from "react";
type WaveVisualizerProps = {
  audio: HTMLAudioElement | null;
};

export default function WaveVisualizer({ audio }: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audio) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const audioCtx = new AudioContext();

    // Sometimes AudioContext needs a resume() to start
    audioCtx.resume();

    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;

        ctx.fillStyle = "#6a5acd"; // purple waves
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    // Cleanup: Important to stop errors when audio changes
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      try {
        source.disconnect();
        analyser.disconnect();
        audioCtx.close();
      } catch (err) {
        console.warn("Audio cleanup error:", err);
      }
    };
  }, [audio]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={120}
      style={{
        width: "100%",
        height: "120px",
        background: "#111",
        borderRadius: "10px",
        marginTop: "15px",
      }}
    />
  );
}
