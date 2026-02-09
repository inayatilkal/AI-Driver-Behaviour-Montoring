import { Eye, ShieldAlert, MonitorSmartphone, Volume2, CheckCircle2 } from 'lucide-react';

export function GuidancePanel() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Guidance Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <CheckCircle2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">How It Works</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Our AI system monitors your attentiveness in real-time. Position your camera directly in front of you ensuring your face is clearly visible.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <span className="p-1.5 bg-green-500/10 rounded-md mt-0.5">
                                <Eye className="w-4 h-4 text-green-400" />
                            </span>
                            <div>
                                <strong className="block text-white mb-1">Drowsiness Detection</strong>
                                <span className="text-slate-400 text-sm">Monitors eye closure patterns to detect fatigue signs early.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <span className="p-1.5 bg-yellow-500/10 rounded-md mt-0.5">
                                <ShieldAlert className="w-4 h-4 text-yellow-400" />
                            </span>
                            <div>
                                <strong className="block text-white mb-1">Distraction Detection</strong>
                                <span className="text-slate-400 text-sm">Tracks head movement to ensure your focus remains on the road.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <span className="p-1.5 bg-red-500/10 rounded-md mt-0.5">
                                <MonitorSmartphone className="w-4 h-4 text-red-400" />
                            </span>
                            <div>
                                <strong className="block text-white mb-1">Phone Detection</strong>
                                <span className="text-slate-400 text-sm">Identifies downward head tilt associated with phone usage.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Safety Tips Card */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-800/50 backdrop-blur-sm border border-indigo-500/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <Volume2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Safety System</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                            <h4 className="font-semibold text-indigo-300 mb-2">Real-time Alerts</h4>
                            <p className="text-indigo-200/80 text-sm">
                                If unsafe behavior is detected, you will hear an immediate audio alert.
                                The visual indicator will turn red to warn you.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-3">Best Practices</h4>
                            <ul className="space-y-2 text-slate-300 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    Ensure good lighting conditions
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    Position camera at eye level
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    Take breaks every 2 hours
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    Keep volume enabled for alerts
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
