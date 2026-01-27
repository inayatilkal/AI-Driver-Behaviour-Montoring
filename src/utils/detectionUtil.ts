import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export interface DetectionState {
  isDistracted: boolean;
  isDrowsy: boolean;
  isUsingPhone: boolean;
  eyeAspectRatio: number;
  headPose: { pitch: number; yaw: number };
}

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

export function calculateHeadPose(
  landmarks: Array<{ x: number; y: number; z: number }>
) {
  const nose = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const chin = landmarks[152];

  const eyeCenter = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
    z: (leftEye.z + rightEye.z) / 2,
  };

  const yaw =
    Math.atan2(nose.x - eyeCenter.x, nose.z - eyeCenter.z) * (180 / Math.PI);
  const pitch = Math.atan2(chin.y - nose.y, chin.z - nose.z) * (180 / Math.PI);

  return { pitch, yaw };
}

export function detectDrowsiness(
  ear: number,
  threshold: number = 0.2
): boolean {
  return ear < threshold;
}

export function detectDistraction(
  yaw: number,
  threshold: number = 150
): boolean {
  return yaw < threshold;
}

export function detectPhoneUsage(
  pitch: number,
  yaw: number,
  pitchThreshold: number = 42,
  yawThreshold: number = 150
): boolean {
  return pitch < pitchThreshold;
}

export function getEyeLandmarks(keypoints: Array<{ x: number; y: number }>) {
  const leftEye = [
    keypoints[33],
    keypoints[160],
    keypoints[158],
    keypoints[133],
    keypoints[153],
    keypoints[144],
  ];
  const rightEye = [
    keypoints[362],
    keypoints[385],
    keypoints[387],
    keypoints[263],
    keypoints[373],
    keypoints[380],
  ];
  return { leftEye, rightEye };
}
