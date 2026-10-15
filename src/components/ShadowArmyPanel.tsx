import React, { useState } from 'react';
import { ArrowUpCircle, Flame, Lock, RotateCcw, Sparkles } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

export const ShadowArmyPanel: React.FC = () => {
  const {
    profile,
    shadows,
    workoutHistory,
    ariseCandidate,
    attemptShadowExtraction,
    dismissAriseModal,
    upgradeShadow,
    resetHunterSystem
  } = useSystem();

  const [extractionFeedback, setExtractionFeedback] = useState<string | null>(null);

  const unlockedCount = shadows.filter((s) => s.unlocked).length;

  const handleAriseCommand = () => {
    const res = attemptShadowExtraction();
    setExtractionFeedback(res.message);
  };

  return (
    <>
      <div className="system-window p-5 sm:p-6 space-y-6">
        {/* Centered Header */}
        <div className="text-center space-y-2">
          <div className="inline-block px-5 py-1 border border-[var(--sys-border)] bg-[var(--sys-badge-bg)]">
            <h2 className="font-hud font-bold text-base sm:text-lg tracking-[0.26em] sys-text-glow uppercase">
              SHADOW ARMY ({unlockedCount}/{shadows.length})
            </h2>
          </div>
          <p className="font-mono-sys text-xs text-slate-400">
            CLEAR DUNGEON GATES TO EXTRACT SHADOW SOLDIERS (&ldquo;ARISE&rdquo;)
          </p>
          <div className="sys-divider" />
        </div>

        {/* Clean Shadow List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shadows.map((s) => {
            const upgradeCost = s.level * 450;
            const canAfford = profile.gold >= upgradeCost;

            return (
              <div
                key={s.id}
                className={`p-3.5 rounded border flex flex-col justify-between gap-3 ${
                  s.unlocked
                    ? 'border-[var(--sys-border)] bg-slate-950/90'
                    : 'border-slate-800/80 bg-slate-950/50 opacity-65'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded border border-slate-700 bg-slate-900 flex items-center justify-center text-lg shrink-0">
                    {s.unlocked ? s.avatarGlyph : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-hud font-bold text-sm text-white">{s.name}</h3>
                      <span className="font-mono-sys text-[10px] text-[var(--sys-accent)]">
                        {s.unlocked ? `Lv.${s.level}` : s.rank}
                      </span>
                    </div>
                    <div className="font-mono-sys text-xs text-cyan-300 mt-0.5">
                      {s.passiveBuffText}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {s.unlocked ? s.title : s.unlockRequirement}
                    </div>
                  </div>
                </div>

                {s.unlocked && (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => upgradeShadow(s.id)}
                    className="sys-btn-primary w-full py-1.5 rounded font-hud font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>Promote ({upgradeCost}G)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Cleared Gates Log */}
        {workoutHistory.length > 0 && (
          <>
            <div className="sys-divider" />
            <div className="space-y-2">
              <div className="font-hud font-bold text-xs tracking-[0.2em] text-[var(--sys-accent)] uppercase">
                RECENT CLEARED GATES
              </div>
              {workoutHistory.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between py-2 px-3 rounded bg-slate-950/80 border border-slate-800 text-xs font-mono-sys"
                >
                  <div>
                    <div className="text-white font-bold">{rec.dungeonName}</div>
                    <div className="text-slate-400 text-[11px]">
                      {rec.setsCompleted} sets • {rec.totalVolumeKg.toLocaleString()} kg
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">+{rec.xpEarned} XP</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={resetHunterSystem}
            className="inline-flex items-center gap-1 text-[11px] font-mono-sys text-slate-500 hover:text-rose-400 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset System Memory</span>
          </button>
        </div>
      </div>

      {/* Interactive "ARISE" Shadow Extraction Modal */}
      {ariseCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="system-window w-full max-w-md p-6 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] font-mono-sys text-xs text-[var(--sys-accent)] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SHADOW EXTRACTION AVAILABLE</span>
            </div>

            <div className="text-4xl">{ariseCandidate.shadow.avatarGlyph}</div>

            <div className="space-y-1">
              <h3 className="font-hud font-bold text-xl text-white tracking-wider uppercase">
                {ariseCandidate.shadow.name} // {ariseCandidate.shadow.title}
              </h3>
              <p className="text-xs text-slate-300">{ariseCandidate.reason}</p>
            </div>

            {extractionFeedback && (
              <div className="text-xs font-mono-sys text-amber-300">{extractionFeedback}</div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleAriseCommand}
                className="sys-btn-primary flex-1 py-3 px-6 rounded font-hud font-bold text-base tracking-[0.28em] uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-5 h-5" />
                <span>&ldquo;ARISE&rdquo;</span>
              </button>
              <button
                type="button"
                onClick={dismissAriseModal}
                className="px-4 py-3 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white font-hud text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
