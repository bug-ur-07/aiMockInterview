"use client";
import React, { useRef, useState, useEffect } from "react";

export default function VideoCall() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const original_height = window.innerHeight;
    const original_width = window.innerWidth;
    const VISIBILITY = () => {
      if (document.hidden) {
        alert("do,not change the tab");
      }
    };

    const HANDEL_RESIZE = () => {
      const heightPercentage = window.innerHeight / original_height;
      const widthPercnetage = window.innerWidth / original_width;

      if (heightPercentage < 0.7 || widthPercnetage < 0.7) {
        // alert("❌ Cheating detected: window minimized by 30%");
        console.log("❌ Cheating detected: window minimized by 30%");
      }
    };

    window.addEventListener("resize", HANDEL_RESIZE);
    document.addEventListener("visibilitychange", VISIBILITY);

    return () => {
      window.removeEventListener("resize", HANDEL_RESIZE);
      document.removeEventListener("visibilitychange", VISIBILITY);
    };
  }, []);

  useEffect(() => {
    const getLocalMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.error("Error accessing local media devices:", error);
      }
    };

    getLocalMediaStream();

    // Cleanup: Stop tracks when component unmounts
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <>
      <div>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{
            transform: "scaleX(-1)",
            width: "100%",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      </div>
    </>
  );
}
