import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminBar({ showClosed, setShowClosed, onLockAdmin }) {
  const router = useRouter();

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-purple-900/40 px-4 py-2.5 shadow-lg flex flex-wrap items-center justify-between gap-3 text-sm z-50 sticky top-0">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="bg-purple-900/60 text-purple-200 text-xs font-semibold px-2 py-0.5 rounded border border-purple-700/50">
          🛡️ Admin Mode
        </span>
        <span className="hidden sm:inline text-slate-400">| Live Inline Editing Enabled</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Toggle Closed Jobs filter if function provided */}
        {setShowClosed && (
          <button
            onClick={() => setShowClosed(!showClosed)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition border ${
              showClosed
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
            title="Toggle visibility of closed/expired jobs"
          >
            {showClosed ? "👁️ Showing Closed Jobs" : "🙈 Hide Closed Jobs"}
          </button>
        )}

        <Link
          href="/admin"
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs font-semibold rounded-md transition shadow-sm flex items-center gap-1"
        >
          ➕ Add Job
        </Link>

        <button
          onClick={onLockAdmin}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 text-xs font-semibold rounded-md transition"
        >
          🔒 Lock Admin
        </button>
      </div>
    </div>
  );
}
