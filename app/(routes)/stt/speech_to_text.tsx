"use client";
import { useRef } from "react";

type SttResponseProps = {
  onTranscript?: (text: string) => void;
  onStop?: () => void;
};

export default function SttResponse({
  onTranscript,
  onStop,
}: SttResponseProps) {
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceLoopRunning = useRef<boolean>(false);

  const startRecording = async () => {
    console.log("STT STARTED");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream);

    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;

    const dataArray = new Uint8Array(analyserRef.current.fftSize);
    sourceRef.current.connect(analyserRef.current);

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    chunksRef.current = [];
    mediaRecorderRef.current = recorder;

    let silenceSeconds = 0;
    silenceLoopRunning.current = true;

    const checkSilence = () => {
      if (!silenceLoopRunning.current) return;

      analyserRef.current!.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] - 128;
        sum += Math.abs(v);
      }

      const volume = sum / dataArray.length;

      if (volume < 5) {
        silenceSeconds += 0.1;
      } else {
        silenceSeconds = 0;
      }

      if (silenceSeconds >= 3.4) {
        console.log("Silent for 5 sec → AUTO STOP");
        stopRecording();
        return;
      }

      setTimeout(checkSilence, 100);
    };

    checkSilence();

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.start(300);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    console.log("STT STOPPED");
    silenceLoopRunning.current = false;
    recorder.stop();

    recorder.onstop = async () => {
      try {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
        await audioCtxRef.current?.close();
      } catch (err) {
        console.log("Cleanup error:", err);
      }

      sourceRef.current = null;
      analyserRef.current = null;
      audioCtxRef.current = null;

      const audioBlob = new Blob(chunksRef.current, {
        type: "audio/webm;codecs=opus",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const RESPONSE = await fetch("/api/text_convertor", {
        method: "POST",
        body: formData,
      });

      const raw = await RESPONSE.json();

      const finalText = raw.text || raw.transcript || "";

      onTranscript?.(finalText);
      onStop?.();
    };
  };

  return {
    startRecording,
    stopRecording,
  };
}
