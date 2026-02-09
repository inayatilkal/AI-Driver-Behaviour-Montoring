# Code Deep Dive: AI Driver Safety Monitor

This document provides a detailed, line-by-line analysis of the core AI logic in the application.

## 1. `src/utils/detectionUtil.ts`

This file contains the pure mathematical functions used to analyze facial landmarks.

### Imports & Interfaces
```typescript
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export interface DetectionState {
  isDistracted: boolean;
  isDrowsy: boolean;
  isUsingPhone: boolean;
  eyeAspectRatio: number;
  headPose: { pitch: number; yaw: number };
}
```
- **Line 1:** Imports the library types (though not strictly used for runtime logic here, good for type safety).
- **Lines 3-9:** Defines the `DetectionState` interface. This shapes the data object that the UI uses to show alerts. It tracks the boolean flags for alerts and the raw numbers (`eyeAspectRatio`, `headPose`) for debugging.

### `calculateEyeAspectRatio(eye)`
Calculates the "openness" of an eye.
```typescript
export function calculateEyeAspectRatio(
  eye: Array<{ x: number; y: number }>
): number {
  const vertical1 = Math.sqrt(
    Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2)
  );
  const vertical2 = Math.sqrt(
    Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2)
  );
  const horizontal = Math.sqrt(
    Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2)
  );
  return (vertical1 + vertical2) / (2.0 * horizontal);
}
```
- **Logic:**
  - The eye is represented by 6 points (0-5).
  - **Points 1 & 5:** A vertical pair (top-left & bottom-left of the eyelid).
  - **Points 2 & 4:** Another vertical pair (top-right & bottom-right).
  - **Points 0 & 3:** The horizontal corners (outer & inner).
  - **Formula:** It computes the average vertical height and divides it by the width. `(v1 + v2) / 2` gives average height. Then divide by `horizontal`.
  - **Result:** A value near `0.3` is open, `< 0.2` is closed.

**Simplification Example:**
> Imagine measuring a window.
> - **Height (left side):** 10cm (`vertical1`)
> - **Height (right side):** 10cm (`vertical2`)
> - **Width:** 30cm (`horizontal`)
> - **Calculation:** Average Height = `(10+10)/2 = 10`. Ratio = `10 / 30 = 0.33`.
> - **Meaning:** The window is open. If height was 2cm, ratio would be `0.06` (Closed).

### `calculateHeadPose(landmarks)`
Estimates where the head is looking based on 2D landmarks.
```typescript
export function calculateHeadPose(landmarks: Array<{ x: number; y: number; z: number }>) {
  const nose = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const chin = landmarks[152];

  const eyeCenter = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
    z: (leftEye.z + rightEye.z) / 2,
  };

  const yaw = Math.atan2(nose.x - eyeCenter.x, nose.z - eyeCenter.z) * (180 / Math.PI);
  const pitch = Math.atan2(chin.y - nose.y, chin.z - nose.z) * (180 / Math.PI);

  return { pitch, yaw };
}
```

- **Lines 29-32:** Extracts specific key landmarks: Nose tip, Eyes, and Chin.
- **Lines 34-38:** Calculates the "Center of the Eyes" to use as a stable reference point.
- **Line 40 (`yaw`):** Calculates horizontal rotation (Left/Right).
- **Line 42 (`pitch`):** Calculates vertical rotation (Up/Down).

**Simplification Example:**
> Imagine a joystick.
> - **Neutral:** The stick is in the center (Values near 0 or 90).
> - **Yaw (Left/Right):** Pushing the stick Left is like turning your head Left. The value changes (e.g., drops from 150 to 120).
> - **Pitch (Up/Down):** Pushing the stick Down is like looking down at a phone. The value drops (e.g., from 80 to 30).

### Detection Threshold Functions
```typescript
export function detectDrowsiness(ear: number, threshold: number = 0.2): boolean {
  return ear < threshold;
}
```
- **Lines 47-51:** Returns `true` if the EAR is below 0.2 (eyes closed).

**Simplification Example:**
> **Input:** `ear = 0.15`, `threshold = 0.2`
> **Check:** Is `0.15 < 0.2`? -> **Yes**.
> **Output:** `true` (Driver is Drowsy).

```typescript
export function detectDistraction(yaw: number, threshold: number = 150): boolean {
  return yaw < threshold;
}
```
- **Lines 54-58:** Returns `true` if `yaw` is less than 150.

**Simplification Example:**
> **Input:** `yaw = 120` (Looking left), `threshold = 150`
> **Check:** Is `120 < 150`? -> **Yes**.
> **Output:** `true` (Driver is Distracted).

```typescript
export function detectPhoneUsage(pitch: number, yaw: number, ...): boolean {
  return pitch < pitchThreshold;
}
```
- **Lines 61-67:** Checks if `pitch` is below 42 (looking down).

**Simplification Example:**
> **Input:** `pitch = 30` (Looking down), `threshold = 42`
> **Check:** Is `30 < 42`? -> **Yes**.
> **Output:** `true` (Driver is Using Phone).

### Example Scenarios

#### 1. Drowsiness (EAR)
- **Scenario A (Wide Open Eyes):**
  - Vertical distance is large (e.g., 10px).
  - Horizontal width is 30px.
  - `EAR = (10 + 10) / (2 * 30) = 0.33`
  - **Result:** `0.33 > 0.2` -> **Awake**.
- **Scenario B (Blinking/Sleeping):**
  - Vertical distance is very small (e.g., 2px).
  - Horizontal width is 30px.
  - `EAR = (2 + 2) / (2 * 30) = 0.06`
  - **Result:** `0.06 < 0.2` -> **Drowsy Alert!**

#### 2. Distraction (Yaw)
- **Scenario A (Looking Straight):**
  - Nose is aligned with eyes. `Yaw ≈ 90` degrees.
  - **Result:** `90 > 150` is False. (Wait, check logic: `detectDistraction` returns true if `yaw < 150`. Actually, standard Facing-Camera Yaw is often around 90-100 depending on coordination system. Let's assume standard webcam: strictly facing forward is often ~90 or 0 depending on the math. In this specific code: `Math.atan2(..., z)`.
  - *Correction based on code:* The code calculates an angle. If the driver looks **left**, the angle drops.
  - **Example:** Yaw drops to `130` degrees.
  - **Result:** `130 < 150` -> **Distracted Alert!**

#### 3. Phone Usage (Pitch)
- **Scenario A (Looking Up/Straight):**
  - Chin is far below nose. Pitch is high (e.g., `80` degrees).
  - **Result:** `80 < 42` is False -> **Safe**.
- **Scenario B (Looking Down at Lap):**
  - Chin moves "up" relative to nose in the 2D plane projection, or Z-depth changes. Pitch drops.
  - **Example:** Pitch drops to `30` degrees.
  - **Result:** `30 < 42` -> **Phone Usage Alert!**

---

## 2. `src/hooks/useDriverMonitoring.ts`

This file manages the React lifecycle and the integration with the AI model.

### Refs & State
```typescript
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
const animationRef = useRef<number>();
```
- **Lines 15-16:** References to the `<video>` and `<canvas>` DOM elements so we can manipulate them directly (classic need for libraries like TensorFlow/Canvas).
- **Line 17:** Stores the loaded AI model. We use `useRef` because we don't want a re-render when the model loads, we just want to keep it available.
- **Line 19:** Stores the ID of the `requestAnimationFrame` loop so we can cancel it later.

### `playAlertSound`
```typescript
const playAlertSound = useCallback(() => {
  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContext();
  }
  // ... setup oscillator ...
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
}, []);
```
- **Lines 37-57:** Creates a browser `AudioContext` to play a generic "beep" sound.
- **Why?** Browsers often block auto-playing audio files, but synthesized beeps (Oscillators) usually work better for alerts once interaction has happened.

### `initializeDetector`
```typescript
const initializeDetector = useCallback(async () => {
  await tf.ready(); // Wait for TensorFlow to startup
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net....", // Critical: Points to the exact version of the assets
    refineLandmarks: true,
  };
  detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
}, []);
```
- **Lines 59-79:** Loads the heavy AI model.
- **Line 67 (`solutionPath`):** This is a specific workaround. Sometimes the default CDN path fails, so we hardcode a reliable jsDelivr URL for the detection assets (like `face_mesh.js`).

### `detectFaces` (The Main Loop)
```typescript
const detectFaces = useCallback(async () => {
  // Check if everything is ready
  if (!videoRef.current || !canvasRef.current || !detectorRef.current) {
    animationRef.current = requestAnimationFrame(detectFaces); // Keep trying
    return;
  }
  
  // ... Setup Canvas ...
  
  const faces = await detectorRef.current!.estimateFaces(video); // AI Inference
  
  if (faces.length > 0) {
    // Process Face Data
    const face = faces[0];
    const { leftEye, rightEye } = getEyeLandmarks(face.keypoints);
    // ... Calculate Metrics ...
    
    // Update State
    setDetectionState({ ... });
    
    // Draw on Canvas
    // Green if safe, Red if unsafe
    ctx.strokeStyle = isUnsafe ? "#ef4444" : "#22c55e"; 
    // ... draw points ...
  }
  
  // Loop again
  animationRef.current = requestAnimationFrame(detectFaces);
}, [playAlertSound]);
```
- **Line 119:** `estimateFaces(video)` is the heavy lifter. It sends the current video frame to the GPU/WAS module and waits for results.
- **Lines 136-138:** Calls our utility functions (`detectDrowsiness`, etc.) to get booleans.
- **Lines 141-146:** Tracks **Duration**. It sums up `deltaTime` to see how long the driver has been distracted.
- **Line 206:** `requestAnimationFrame(detectFaces)` creates the infinite loop that runs as fast as the browser allows (usually 60fps, but limited by AI speed).
