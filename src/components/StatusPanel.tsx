import { DetectionState } from '../utils/detectionUtil';
import { AlertIndicator } from './AlertIndicator';

interface StatusPanelProps {
  detectionState: DetectionState;
}

export function StatusPanel({ detectionState }: StatusPanelProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertIndicator
          isActive={detectionState.isDrowsy}
          label="Drowsiness"
        />
        <AlertIndicator
          isActive={detectionState.isDistracted}
          label="Distraction"
        />
        <AlertIndicator
          isActive={detectionState.isUsingPhone}
          label="Phone Usage"
        />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-time Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
            <span className="text-slate-400 block mb-1">Eye Aspect Ratio</span>
            <span className="font-mono font-bold text-xl text-emerald-400">
              {detectionState.eyeAspectRatio.toFixed(3)}
            </span>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
            <span className="text-slate-400 block mb-1">Head Yaw</span>
            <span className="font-mono font-bold text-xl text-blue-400">
              {detectionState.headPose.yaw.toFixed(1)}°
            </span>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
            <span className="text-slate-400 block mb-1">Head Pitch</span>
            <span className="font-mono font-bold text-xl text-indigo-400">
              {detectionState.headPose.pitch.toFixed(1)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
