import { Settings } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Gear */}
        <Settings className="h-16 w-16 animate-[spin_3s_linear_infinite] text-primary-600" />
        <p className="font-heading text-xl font-bold tracking-widest text-primary-800 animate-pulse">
          MMW
        </p>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Powering up...
        </p>
      </div>
    </div>
  )
}
