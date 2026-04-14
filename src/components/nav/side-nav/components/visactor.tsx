import { Trash2 } from "lucide-react";

export default function VisActor() {
  return (
    <div className="relative my-2 flex flex-col items-center justify-center gap-y-2 px-4 py-4">
      <div className="dot-matrix absolute left-0 top-0 -z-10 h-full w-full" />
      <span className="text-xs text-muted-foreground">Sistem Manajemen</span>
      <div className="flex items-center space-x-2">
        <Trash2 size={24} className="text-green-600" />
        <span className="text-md text-accent-foreground">Bank Sampah</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground text-center">
        Mengelola dan memaksimalkan nilai sampah untuk keberlanjutan lingkungan
      </p>
    </div>
  );
}
