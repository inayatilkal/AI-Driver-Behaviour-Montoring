import { DetectionState } from '../utils/detectionUtil';
import { AlertIndicator } from './AlertIndicator';

interface StatusPanelProps {
  detectionState: DetectionState;
}

export function StatusPanel({ detectionState }: StatusPanelProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertIndicator
          isActive={detectionState.isDrowsy}
          label="Drowsiness Detected"
        />
        <AlertIndicator
          isActive={detectionState.isDistracted}
          label="Distraction Detected"
        />
        <AlertIndicator
          isActive={detectionState.isUsingPhone}
          label="Phone Usage Detected"
        />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Detection Metrics
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Eye Aspect Ratio:</span>
            <span className="font-mono font-semibold text-gray-800">
              {detectionState.eyeAspectRatio.toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Head Yaw (Left/Right):</span>
            <span className="font-mono font-semibold text-gray-800">
              {detectionState.headPose.yaw.toFixed(1)}°
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Head Pitch (Down):</span>
            <span className="font-mono font-semibold text-gray-800">
              {detectionState.headPose.pitch.toFixed(1)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
