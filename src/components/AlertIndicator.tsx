import { AlertTriangle } from 'lucide-react';

interface AlertIndicatorProps {
  isActive: boolean;
  label: string;
}

export function AlertIndicator({ isActive, label }: AlertIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? 'bg-red-500 text-white shadow-lg scale-105'
          : 'bg-gray-200 text-gray-600'
      }`}
    >
      <AlertTriangle size={20} />
      <span className="font-semibold">{label}</span>
    </div>
  );
}
