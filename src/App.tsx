import { Camera, StopCircle } from 'lucide-react';
import { useDriverMonitoring } from './hooks/useDriverMonitoring';
import { CameraPreview } from './components/CameraPreview';
import { StatusPanel } from './components/StatusPanel';

function App() {
  const {
    videoRef,
    canvasRef,
    isDetecting,
    detectionState,
    startDetection,
    stopDetection,
  } = useDriverMonitoring();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Driver Monitoring System
          </h1>
          <p className="text-slate-300 text-lg">
            AI-powered detection for drowsiness, distraction, and phone usage
          </p>
        </div>

        <div className="flex justify-center mb-6">
          {!isDetecting ? (
            <button
              onClick={startDetection}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Camera size={24} />
              Start Detection
            </button>
          ) : (
            <button
              onClick={stopDetection}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <StopCircle size={24} />
              Stop Detection
            </button>
          )}
        </div>

        {isDetecting && (
          <>
            <CameraPreview videoRef={videoRef} canvasRef={canvasRef} />
            <StatusPanel detectionState={detectionState} />
          </>
        )}

        {!isDetecting && (
          <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg p-8 text-slate-300 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              How It Works
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>
                  <strong className="text-white">Drowsiness Detection:</strong>{' '}
                  Monitors eye closure patterns to detect fatigue
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>
                  <strong className="text-white">Distraction Detection:</strong>{' '}
                  Tracks head orientation to ensure driver is looking at the
                  road
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>
                  <strong className="text-white">Phone Usage Detection:</strong>{' '}
                  Identifies downward head tilt indicating phone use
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>
                  <strong className="text-white">Real-time Alerts:</strong> Audio
                  beep sounds when unsafe behavior is detected
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
