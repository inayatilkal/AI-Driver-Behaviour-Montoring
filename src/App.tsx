import { Camera, StopCircle } from 'lucide-react';
import { useDriverMonitoring } from './hooks/useDriverMonitoring';
import { CameraPreview } from './components/CameraPreview';
import { GuidancePanel } from './components/GuidancePanel';
import { SessionReport } from './components/SessionReport';
import { StatusPanel } from './components/StatusPanel';



function App() {
  const {
    videoRef,
    canvasRef,
    isDetecting,
    detectionState,
    sessionReport,
    startDetection,
    stopDetection,
    clearSessionReport,
  } = useDriverMonitoring();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-in fade-in-down duration-500">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 drop-shadow-lg">
            Driver Safety AI
          </h1>
          <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto">
            Advanced real-time monitoring system for drowsy and distracted driving detection
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          {sessionReport ? (
            <SessionReport
              report={sessionReport}
              onRestart={() => {
                clearSessionReport();
                // Optionally auto-start or let user click start
              }}
            />
          ) : (
            <>
              <div className="flex justify-center mb-12">
                {!isDetecting ? (
                  <button
                    onClick={startDetection}
                    className="group relative flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Camera className="w-8 h-8" />
                    <span>Start Monitoring</span>
                  </button>
                ) : (
                  <button
                    onClick={stopDetection}
                    className="group relative flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-300"
                  >
                    <StopCircle className="w-8 h-8" />
                    <span>Stop Session</span>
                  </button>
                )}
              </div>

              {isDetecting ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <CameraPreview videoRef={videoRef} canvasRef={canvasRef} />
                  <StatusPanel detectionState={detectionState} />
                </div>
              ) : (
                <GuidancePanel />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
