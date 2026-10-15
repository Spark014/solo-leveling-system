import React from 'react';
import { Check, Gift, Plus, Sparkles } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

export const DailyQuestPanel: React.FC = () => {
  const {
    profile,
    dailyQuests,
    incrementDailyQuest,
    claimDailyRewards,
    addProtein,
    addHydration
  } = useSystem();

  const proteinDone = profile.proteinGrams >= profile.proteinTargetGrams;
  const waterDone = profile.hydrationMl >= profile.hydrationTargetMl;

  return (
    <div className="system-window p-5 sm:p-6 space-y-6">
      {/* Authentic Anime Centered [ QUEST INFO ] Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-5 py-1 border border-[var(--sys-border)] bg-[var(--sys-badge-bg)]">
          <span className="w-4 h-4 rounded-full border border-[var(--sys-primary)] flex items-center justify-center text-[10px] font-bold sys-text-glow">
            !
          </span>
          <h2 className="font-hud font-bold text-base sm:text-lg tracking-[0.28em] sys-text-glow uppercase">
            QUEST INFO
          </h2>
        </div>
        <p className="font-mono-sys text-xs text-slate-300 tracking-wider">
          [Daily Quest: Preparations to Become Strong]
        </p>
        <div className="sys-divider" />
      </div>

      {/* Clean Goal Checklist (Single-Tap Progress) */}
      <div className="space-y-3">
        <div className="text-center font-hud font-bold text-xs tracking-[0.25em] text-[var(--sys-accent)] uppercase">
          GOAL
        </div>

        <div className="space-y-2.5">
          {dailyQuests.map((q) => {
            const isComplete = q.current >= q.target;
            return (
              <div
                key={q.id}
                className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-950/70 border border-slate-800/90"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                      isComplete
                        ? 'border-[var(--sys-primary)] bg-[var(--sys-primary)] text-slate-950'
                        : 'border-slate-600'
                    }`}
                  >
                    {isComplete && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`font-hud text-sm sm:text-base ${
                      isComplete ? 'text-slate-300' : 'text-white font-semibold'
                    }`}
                  >
                    {q.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono-sys text-sm text-white">
                    [{q.current} / {q.target}
                    {q.unit === 'km' ? 'km' : ''}]
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      incrementDailyQuest(
                        q.id,
                        isComplete ? -q.current : q.stepSize
                      )
                    }
                    className="px-2.5 py-1 rounded sys-btn-primary font-mono-sys text-xs font-bold cursor-pointer"
                  >
                    {isComplete ? 'Reset' : `+${q.stepSize}`}
                  </button>
                </div>
              </div>
            );
          })}

          {/* 187cm / 80kg Daily Macro & Hydration Goals */}
          <div className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-950/70 border border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                  proteinDone
                    ? 'border-[var(--sys-primary)] bg-[var(--sys-primary)] text-slate-950'
                    : 'border-slate-600'
                }`}
              >
                {proteinDone && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="font-hud text-sm sm:text-base text-white font-semibold">
                Protein Intake (80kg Target)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-sys text-sm text-white">
                [{profile.proteinGrams} / {profile.proteinTargetGrams}g]
              </span>
              <button
                type="button"
                onClick={() =>
                  addProtein(
                    proteinDone ? -profile.proteinGrams : 35
                  )
                }
                className="px-2.5 py-1 rounded sys-btn-primary font-mono-sys text-xs font-bold cursor-pointer"
              >
                {proteinDone ? 'Reset' : '+35g'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-950/70 border border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                  waterDone
                    ? 'border-[var(--sys-primary)] bg-[var(--sys-primary)] text-slate-950'
                    : 'border-slate-600'
                }`}
              >
                {waterDone && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="font-hud text-sm sm:text-base text-white font-semibold">
                Hydration (Stamina)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-sys text-sm text-white">
                [{profile.hydrationMl} / {profile.hydrationTargetMl}ml]
              </span>
              <button
                type="button"
                onClick={() =>
                  addHydration(
                    waterDone ? -profile.hydrationMl : 400
                  )
                }
                className="px-2.5 py-1 rounded sys-btn-primary font-mono-sys text-xs font-bold cursor-pointer"
              >
                {waterDone ? 'Reset' : '+400ml'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sys-divider" />

      {/* Canonical Solo Leveling 3-Part Completion Rewards */}
      <div className="space-y-3">
        <div className="text-center font-hud font-bold text-xs tracking-[0.25em] text-[var(--sys-accent)] uppercase">
          COMPLETION REWARDS
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono-sys text-xs">
          <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
            <div className="text-[var(--sys-accent)] font-bold">REWARD 1</div>
            <div className="text-slate-300 text-[11px] mt-0.5">Status Recovery</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
            <div className="text-[var(--sys-accent)] font-bold">REWARD 2</div>
            <div className="text-slate-300 text-[11px] mt-0.5">+3 Stat Points</div>
          </div>
          <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
            <div className="text-[var(--sys-accent)] font-bold">REWARD 3</div>
            <div className="text-slate-300 text-[11px] mt-0.5">1x Random Box</div>
          </div>
        </div>

        {profile.dailyQuestCompletedToday && !profile.dailyRewardsClaimedToday ? (
          <button
            type="button"
            onClick={claimDailyRewards}
            className="sys-btn-primary w-full py-3 rounded font-hud font-bold text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>[ ACCEPT COMPLETION REWARDS ]</span>
          </button>
        ) : profile.dailyRewardsClaimedToday ? (
          <div className="text-center py-2 font-mono-sys text-xs text-emerald-400">
            ✓ Daily Quest Rewards Claimed Today
          </div>
        ) : (
          <p className="text-center font-mono-sys text-[11px] text-slate-400">
            CAUTION: If the Daily Quest remains incomplete, penalty protocol will activate.
          </p>
        )}
      </div>
    </div>
  );
};
