import { Clock, AlertTriangle, Moon, Smartphone, RefreshCcw } from 'lucide-react';
import { SessionReport as SessionReportType } from '../hooks/useDriverMonitoring';

interface SessionReportProps {
    report: SessionReportType;
    onRestart: () => void;
}

export function SessionReport({ report, onRestart }: SessionReportProps) {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const calculateSafetyScore = () => {
        const totalUnsafeTime = report.drowsyDuration + report.distractedDuration + report.phoneUsageDuration;
        const score = Math.max(0, 100 - (totalUnsafeTime / report.totalDuration) * 1000); // Penalty calculation
        return Math.min(100, Math.round(score));
    };

    const score = calculateSafetyScore();

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900/50 p-6 text-center border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-2">Session Analysis</h2>
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Total Duration: {report.totalDuration.toFixed(1)}s</span>
                    </div>
                </div>

                {/* Score */}
                <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-slate-900">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-800 mb-4 relative">
                        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                            {score}
                        </div>
                        <div className="absolute text-xs text-slate-500 bottom-6">Safety Score</div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-6 bg-slate-900/30">
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                        <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {report.drowsyDuration.toFixed(1)}s
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Drowsy</div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {report.distractedDuration.toFixed(1)}s
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Distracted</div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                        <Smartphone className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {report.phoneUsageDuration.toFixed(1)}s
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Phone Use</div>
                    </div>
                </div>

                {/* Action */}
                <div className="p-6 bg-slate-900/50 border-t border-slate-700">
                    <button
                        onClick={onRestart}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all hover:scale-[1.02]"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Start New Session
                    </button>
                </div>
            </div>
        </div>
    );
}
