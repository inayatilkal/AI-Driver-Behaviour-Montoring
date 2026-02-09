# Complete Codebase Explanation

This document provides a detailed breakdown of every directory, file, function, and critical variable in the AI Driver Safety Monitor project.

## 1. Project Configuration & Root

### `vite.config.js`
**Purpose:** Configuration for the Vite build tool.

- **plugins:**
    - `react()`: Enables React support in Vite.
    - **mediapipe_workaround (Custom Plugin):**
        - **Why:** The `@mediapipe/face_mesh` library has a known issue in its production build where the `FaceMesh` class is not correctly exported as a module.
        - **How:** It intercepts `face_mesh.js` during the build and appends `exports.FaceMesh = globalThis.FaceMesh;`. This forces the global `FaceMesh` constructor to be available to our code.

### `package.json`
**Purpose:** Defines dependencies and scripts.

- **dependencies:**
    - `@mediapipe/face_mesh`: The core ML model for face tracking.
    - `@tensorflow-models/face-landmarks-detection`: Wrapper around FaceMesh for easier usage.
    - `@tensorflow/tfjs-*`: Backend WebGL computations for the model.
    - `react`, `react-dom`: UI framework.
    - `lucide-react`: Icon library (Camera, Alert icons).

## 2. Application Entry Points

### `src/main.tsx`
**Purpose:** The JavaScript entry point.

- `createRoot(...).render(...)`: Mounts the React application into the `<div id="root">` element in `index.html`.
- **StrictMode:** Active check for potential problems in the app (runs effects twice in dev).

### `src/App.tsx`
**Purpose:** The main application layout and logic orchestrator.

- **Hooks:** Calls `useDriverMonitoring()` to get access to the camera and detection state.
- **Render Logic:**
    - Displays a "Start Detection" button if `!isDetecting`.
    - Displays `<CameraPreview />` and `<StatusPanel />` if `isDetecting` is true.
    - Displays instructions ("How It Works") when idle.

## 3. Core Logic (Hooks & Utils)

### `src/hooks/useDriverMonitoring.ts`
**Purpose:** Manages the AI model, camera stream, and detection loop.

- **Key Variables:**
    - `detectorRef` (useRef): Holds the loaded FaceMesh model instance. References persist without re-renders.
    - `videoRef` & `canvasRef`: Direct references to HTML elements to read video frames and draw overlays.
    - `detectionState` (useState): Holds the latest analysis results (drowsy, distracted, etc.) to update the UI.
    - `animationRef`: ID of the current `requestAnimationFrame` loop, used to cancel the loop on stop.

- **Key Functions:**
    - `initializeDetector()`: Loads the MediaPipe model from the CDN.
        - *Note:* The `solutionPath` is manually configured to point to a specific version on jsDelivr to ensure asset availability.
    - `detectFaces()`: The infinite loop function.
        - Draws video frame to canvas.
        - Runs `detector.estimateFaces()`.
        - Calculates metrics (EAR, Pitch, Yaw).
        - Updates state and plays alert sound `playAlertSound()` if unsafe.
        - Recursively calls itself via `requestAnimationFrame`.

### `src/utils/detectionUtil.ts`
**Purpose:** Pure mathematical functions to interpret facial landmarks.

- **Key Functions:**
    - `calculateEyeAspectRatio(eye)`:
        - **Logic:** `(Vertical Distance) / (Horizontal Distance)`
        - **Usage:** Low value (< 0.2) means eyes are closed (Drowsiness).
    - `calculateHeadPose(landmarks)`:
        - **Logic:** Compares Nose position vs. Eye Center and Chin.
        - **Usage:**
            - **Yaw:** Detects turning head left/right (Distraction).
            - **Pitch:** Detects looking down (Phone Usage).

- **Threshold Constants:**
    - `EAR_THRESHOLD = 0.2`
    - `YAW_THRESHOLD = 150` (degrees)
    - `PITCH_THRESHOLD = 42` (degrees)

## 4. UI Components

### `src/components/CameraPreview.tsx`
**Purpose:** Renders the video feed and the drawing canvas.

- **Props:** Receives `videoRef` and `canvasRef` from the hook.
- **Structure:** The `<canvas>` is positioned absolutely on top of the `<video>` to allow drawing mesh lines over the face.

### `src/components/StatusPanel.tsx`
**Purpose:** Displays the real-time status of the driver.

- **3 Alert Indicators:** Shows Red/Gray status for Drowsiness, Distraction, Phone Usage.
- **Metrics Section:** Displays the raw numbers (EAR, Degrees) for debugging/transparency.

### `src/components/AlertIndicator.tsx`
**Purpose:** A reusable UI chip that lights up Red when an alert is active.

- **Props:** `isActive` (boolean), `label` (string).
- **Styling:** Uses conditional Tailwind classes (`bg-red-500` vs `bg-gray-200`) to indicate state.

## 5. Styling

### `src/index.css`
**Purpose:** Global styles and Tailwind directives.

- `@tailwind base/components/utilities`: Initializes Tailwind CSS.

## 6. External Libraries & Dependencies
This project relies on several key libraries to handle computer vision, UI rendering, and future backend integrations.

| Library | Purpose |
| :--- | :--- |
| **@mediapipe/face_mesh** | The core machine learning model used to detect face landmarks (eyes, nose, mouth) in real-time. |
| **@tensorflow-models/face-landmarks-detection** | A wrapper that simplifies interacting with the FaceMesh model. |
| **@tensorflow/tfjs-*** | Powered by WebGL, this handles the heavy mathematical computations for the ML models directly in the browser. |
| **react / react-dom** | The fundamental JavaScript library for building the user interface. |
| **lucide-react** | Provides the icons used in the UI (e.g., the camera and warning icons). |
| **vite** | The build tool and development server that powers the application. |

### Supabase Usage
**Library:** `@supabase/supabase-js`

- **Current Status:** Installed but **Not Yet Active**.
- **Location:** Linked in `package.json` dependencies.
- **Why it is here:** Supabase is included to facilitate future backend integrations. It is intended to handle:
  - **User Authentication:** Logging in drivers to save their preferences or history.
  - **Data Logging:** Storing unsafe driving incidents (drowsiness/distraction events) to the cloud for reporting.
  - **Real-time Updates:** Potentially pushing alerts to a dashboard.

## 7. AI Model & Detection Logic

### Overview
The core of this application is the **MediaPipe Face Mesh** model, which provides real-time, high-fidelity face tracking.

- **Library Used:** `@tensorflow-models/face-landmarks-detection`
- **Underlying Model:** `MediaPipeFaceMesh`
- **Backend:** `@tensorflow/tfjs` (WebGL accelerated)

> [!NOTE]
> For a detailed, **line-by-line explanation** of the code in `useDriverMonitoring.ts` and `detectionUtil.ts`, please refer to the **[Code Deep Dive](./CodeDeepDive.md)** document.

### Implementation Details

#### 1. Initialization
The model is loaded in `src/hooks/useDriverMonitoring.ts` via the `initializeDetector()` function.
```typescript
const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: "mediapipe", // Uses the lightweight MediaPipe runtime
  refineLandmarks: true, // Increases accuracy for eyes and lips
  solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/",
};
```

#### 2. Keypoint Extraction
The `detectFaces()` function captures a video frame and passes it to the detector:
```typescript
const faces = await detectorRef.current!.estimateFaces(video);
```
This returns a list of **468 3D landmarks** (x, y, z coordinates) for each detected face.

#### 3. Metric Calculation (Safety Logic)
The raw keypoints are processed in `src/utils/detectionUtil.ts` to derive meaningful safety metrics.

**A. Drowsiness Detection (Eye Aspect Ratio - EAR)**
- **Concept:** Measures how "open" the eye is.
- **Landmarks Used:**
    - **Left Eye:** [33, 160, 158, 133, 153, 144]
    - **Right Eye:** [362, 385, 387, 263, 373, 380]
- **Formula:** `(Vertical Distance) / (Horizontal Distance)`
- **Threshold:** If `EAR < 0.2`, the driver is considered **Drowsy**.

**B. Distraction Detection (Head Yaw)**
- **Concept:** Measures if the driver is looking left or right.
- **Landmarks Used:** Nose Tip (1) relative to the Eye Center and Chin (152).
- **Formula:** `Math.atan2(Nose.x - EyeCenter.x, ...)`
- **Threshold:** If `Yaw < 150` degrees, the driver is considered **Distracted** (turning head).

**C. Phone Usage Detection (Head Pitch)**
- **Concept:** Measures if the driver is looking down (typically at a phone).
- **Landmarks Used:** Chin (152) relative to Nose Tip (1).
- **Formula:** `Math.atan2(Chin.y - Nose.y, ...)`
- **Threshold:** If `Pitch < 42` degrees, the driver is suspected of **Phone Usage**.

