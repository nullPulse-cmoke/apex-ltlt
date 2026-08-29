export default function DashboardLoading() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
      {/* Sleek Minimal Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--border-subtle)]" />
        <div className="absolute w-10 h-10 rounded-full border-2 border-transparent border-t-[var(--violet-light)] animate-spin" />
      </div>
      
      {/* Minimal status text */}
      <p className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest uppercase select-none animate-pulse">
        Syncing workspace...
      </p>
    </div>
  )
}
