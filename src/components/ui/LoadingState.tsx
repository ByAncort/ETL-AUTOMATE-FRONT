import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
  icon?: React.ReactNode;
}

export default function LoadingState({ message = 'Cargando...', icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {icon ? (
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            {icon}
          </div>
        </div>
      ) : (
        <Loader2 className="text-blue-500 animate-spin mb-4" size={28} />
      )}
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
