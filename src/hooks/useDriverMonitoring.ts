import { useRef, useCallback, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import {
  DetectionState,
  calculateEyeAspectRatio,
  calculateHeadPose,
  detectDrowsiness,
  detectDistraction,
  detectPhoneUsage,
  getEyeLandmarks,
} from "../utils/detectionUtil";

export function useDriverMonitoring() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef =
    useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const drowsyDurationRef = useRef<number>(0);
  const distractedDurationRef = useRef<number>(0);
  const phoneUsageDurationRef = useRef<number>(0);

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionState, setDetectionState] = useState<DetectionState>({
    isDistracted: false,
    isDrowsy: false,
    isUsingPhone: false,
    eyeAspectRatio: 0,
    headPose: { pitch: 0, yaw: 0 },
  });

  const playAlertSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, []);

  const initializeDetector = useCallback(async () => {
    try {
      await tf.ready();

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
      {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619",
        refineLandmarks: true,
      };

      detectorRef.current = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );
    } catch (error) {
      console.error("Error initializing face detector:", error);
      alert(`Failed to load face detection model: ${(error as Error).message}`);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please grant camera permissions.");
    }
  }, []);

  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) {
      animationRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const faces = await detectorRef.current!.estimateFaces(video);

      if (faces.length > 0) {
        const face = faces[0];
        const keypoints = face.keypoints as Array<{
          x: number;
          y: number;
          z: number;
        }>;

        const { leftEye, rightEye } = getEyeLandmarks(keypoints);
        const leftEAR = calculateEyeAspectRatio(leftEye);
        const rightEAR = calculateEyeAspectRatio(rightEye);
        const avgEAR = (leftEAR + rightEAR) / 2;

        const headPose = calculateHeadPose(keypoints);

        const isDrowsy = detectDrowsiness(avgEAR);
        const isDistracted = detectDistraction(headPose.yaw);
        const isUsingPhone = detectPhoneUsage(headPose.pitch, headPose.yaw);

        const now = Date.now();
        if (lastFrameTimeRef.current > 0) {
          const deltaTime = (now - lastFrameTimeRef.current) / 1000;
          if (isDrowsy) drowsyDurationRef.current += deltaTime;
          if (isDistracted) distractedDurationRef.current += deltaTime;
          if (isUsingPhone) phoneUsageDurationRef.current += deltaTime;
        }
        lastFrameTimeRef.current = now;

        setDetectionState({
          isDistracted,
          isDrowsy,
          isUsingPhone,
          eyeAspectRatio: avgEAR,
          headPose,
        });

        if (isDrowsy || isDistracted || isUsingPhone) {
          playAlertSound();
        }

        ctx.strokeStyle =
          isDrowsy || isDistracted || isUsingPhone ? "#ef4444" : "#22c55e";
        ctx.lineWidth = 2;

        keypoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
          ctx.fillStyle = "#3b82f6";
          ctx.fill();
        });

        leftEye.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = "#facc15";
          ctx.fill();
        });

        rightEye.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = "#facc15";
          ctx.fill();
        });
      } else {
        setDetectionState({
          isDistracted: true,
          isDrowsy: false,
          isUsingPhone: false,
          eyeAspectRatio: 0,
          headPose: { pitch: 0, yaw: 0 },
        });
        playAlertSound();

        const now = Date.now();
        if (lastFrameTimeRef.current > 0) {
          const deltaTime = (now - lastFrameTimeRef.current) / 1000;
          distractedDurationRef.current += deltaTime;
        }
        lastFrameTimeRef.current = now;
      }
    } catch (error) {
      console.error("Error during face detection:", error);
    }

    animationRef.current = requestAnimationFrame(detectFaces);
  }, [playAlertSound]);

  const startDetection = useCallback(async () => {
    try {
      setIsDetecting(true);
      await initializeDetector();
      await startCamera();

      // Reset stats
      startTimeRef.current = Date.now();
      lastFrameTimeRef.current = 0;
      drowsyDurationRef.current = 0;
      distractedDurationRef.current = 0;
      phoneUsageDurationRef.current = 0;

      setTimeout(() => {
        lastFrameTimeRef.current = Date.now();
        detectFaces();
      }, 1500);
    } catch (error) {
      console.error("Error starting detection:", error);
      setIsDetecting(false);
      alert("Failed to start detection. Please try again.");
    }
  }, [initializeDetector, startCamera, detectFaces]);

  const stopDetection = useCallback(() => {
    if (startTimeRef.current > 0) {
      const totalDuration = (Date.now() - startTimeRef.current) / 1000;
      const report = `
Driver Safety Report
-------------------
Total Session Time: ${totalDuration.toFixed(1)}s

Time Distracted: ${distractedDurationRef.current.toFixed(1)}s
Time Drowsy: ${drowsyDurationRef.current.toFixed(1)}s
Time Using Phone: ${phoneUsageDurationRef.current.toFixed(1)}s
    `.trim();
      alert(report);
      startTimeRef.current = 0;
    }

    setIsDetecting(false);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      stopDetection();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopDetection]);

  return {
    videoRef,
    canvasRef,
    isDetecting,
    detectionState,
    startDetection,
    stopDetection,
  };
}
