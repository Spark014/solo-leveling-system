import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, Dumbbell, Swords, Timer, Trash2, Trophy } from 'lucide-react';
import { getTodayRecommendedDayCode } from '../data/systemDatabase';
import { useSystem } from '../context/SystemContext';
import { calculateEstimated1RM } from '../utils/systemArchitect';

const DAY_TABS: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'BOSS')[] = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'BOSS'
];

export const DungeonRaidTracker: React.FC = () => {
  const {
    profile,
    dungeons,
    activeDungeon,
    startDungeonRaid,
    selectActiveExercise,
    logExerciseSet,
    deleteExerciseSet,
    skipRestTimer,
    completeDungeonRaid,
    abandonDungeonRaid
  } = useSystem();

  const [selectedDay, setSelectedDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'BOSS'>(
    () => getTodayRecommendedDayCode()
  );

  const [weightInput, setWeightInput] = useState<number>(65);
  const [repsInput, setRepsInput] = useState<number>(10);

  const currentExercise =
    activeDungeon?.exercises[activeDungeon.activeExerciseIndex]?.template ?? null;

  useEffect(() => {
    if (currentExercise) {
      setWeightInput(currentExercise.suggestedWeightKg);
      const parsedReps = parseInt(currentExercise.targetReps.split('-')[0], 10);
      setRepsInput(Number.isFinite(parsedReps) ? parsedReps : 10);
    }
  }, [currentExercise?.id]);

  // ============================================================================
  // ACTIVE WORKOUT VIEW (Focused One-Exercise-At-A-Time UX)
  // ============================================================================
  if (activeDungeon) {
    const activeExObj = activeDungeon.exercises[activeDungeon.activeExerciseIndex];
    const doneSets = activeExObj.sets.length;
    const targetSets = activeExObj.template.targetSets;
    const nextSetNum = Math.min(targetSets, doneSets + 1);

    const totalSetsAll = activeDungeon.exercises.reduce(
      (sum, e) => sum + e.template.targetSets,
      0
    );
    const completedSetsAll = activeDungeon.exercises.reduce(
      (sum, e) => sum + e.sets.length,
      0
    );
    const bossHpPct = Math.max(
      0,
      Math.min(100, Math.round((activeDungeon.bossCurrentHp / activeDungeon.bossMaxHp) * 100))
    );

    const currentPR = profile.personalRecords[activeExObj.template.id] ?? 0;
    const preview1RM = calculateEstimated1RM(weightInput, repsInput);
    const isNewPR = preview1RM > currentPR && weightInput > 0;

    return (
      <div className="system-window p-5 sm:p-6 space-y-5">
        {/* Minimal Raid Header + Boss HP Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-sys">
            <span className="text-[var(--sys-accent)] uppercase">
              {activeDungeon.dungeon.dayLabel} // {activeDungeon.dungeon.rank}
            </span>
            <button
              type="button"
              onClick={abandonDungeonRaid}
              className="text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              [Exit Gate]
            </button>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-hud font-bold text-base sm:text-lg text-white tracking-wider uppercase">
              {activeDungeon.dungeon.bossName}
            </h2>
            <span className="font-mono-sys text-xs text-rose-300">
              BOSS HP: {bossHpPct}%
            </span>
          </div>

          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all duration-300"
              style={{ width: `${bossHpPct}%` }}
            />
          </div>
        </div>

        <div className="sys-divider" />

        {/* Clean Step Indicator Pills (Exercise 1 • 2 • 3 • 4) */}
        <div className="grid grid-cols-4 gap-2">
          {activeDungeon.exercises.map((ex, idx) => {
            const isCurrent = idx === activeDungeon.activeExerciseIndex;
            const isFinished = ex.sets.length >= ex.template.targetSets;
            return (
              <button
                key={ex.template.id}
                type="button"
                onClick={() => selectActiveExercise(idx)}
                className={`py-2 px-2 rounded border text-center transition cursor-pointer ${
                  isCurrent
                    ? 'border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-white'
                    : isFinished
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="font-mono-sys text-[10px] uppercase">
                  EX {idx + 1} {isFinished && '✓'}
                </div>
                <div className="font-hud font-bold text-xs truncate mt-0.5">
                  {ex.sets.length}/{ex.template.targetSets}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Rest Timer Overlay Banner (if resting) */}
        {activeDungeon.restTimerRunning && (
          <div className="p-3.5 rounded border border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Timer className="w-5 h-5 text-[var(--sys-primary)] animate-spin" />
              <div>
                <div className="font-mono-sys text-[11px] text-[var(--sys-accent)] uppercase">
                  SYSTEM RECOVERY TIMER
                </div>
                <div className="font-mono-sys text-xl font-bold text-white">
                  {String(Math.floor(activeDungeon.restTimerSeconds / 60)).padStart(2, '0')}:
                  {String(activeDungeon.restTimerSeconds % 60).padStart(2, '0')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={skipRestTimer}
              className="px-3 py-1.5 rounded bg-slate-950 border border-[var(--sys-border)] text-xs font-hud uppercase tracking-wider text-white cursor-pointer"
            >
              Skip Rest
            </button>
          </div>
        )}

        {/* Focused Single-Exercise Card */}
        <div className="p-4 sm:p-5 rounded bg-slate-950/80 border border-slate-800 space-y-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-mono-sys text-xs text-[var(--sys-accent)] uppercase">
                SET {nextSetNum} OF {targetSets} • TARGET: {activeExObj.template.targetReps} REPS
              </span>
              <h3 className="font-hud font-bold text-lg sm:text-xl text-white mt-0.5">
                {activeExObj.template.name}
              </h3>
              {activeExObj.template.cue && (
                <p className="text-xs text-slate-400 mt-1">{activeExObj.template.cue}</p>
              )}
            </div>

            {isNewPR && (
              <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400 text-amber-300 font-mono-sys text-[10px] font-bold shrink-0">
                ★ NEW 1RM PR ({preview1RM}KG)
              </span>
            )}
          </div>

          {/* Large Tactile Steppers for Weight & Reps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center space-y-2">
              <div className="font-mono-sys text-[11px] text-slate-400 uppercase">
                WEIGHT (KG)
              </div>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setWeightInput((w) => Math.max(0, Number((w - 2.5).toFixed(1))))}
                  className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-slate-200 font-mono-sys text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono-sys text-xl sm:text-2xl font-bold text-white">
                  {weightInput}
                </span>
                <button
                  type="button"
                  onClick={() => setWeightInput((w) => Number((w + 2.5).toFixed(1)))}
                  className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-slate-200 font-mono-sys text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-center space-y-2">
              <div className="font-mono-sys text-[11px] text-slate-400 uppercase">
                REPS
              </div>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setRepsInput((r) => Math.max(1, r - 1))}
                  className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-slate-200 font-mono-sys text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono-sys text-xl sm:text-2xl font-bold text-white">
                  {repsInput}
                </span>
                <button
                  type="button"
                  onClick={() => setRepsInput((r) => r + 1)}
                  className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-slate-200 font-mono-sys text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Giant Single Action Button */}
          <button
            type="button"
            onClick={() =>
              logExerciseSet({
                exerciseIndex: activeDungeon.activeExerciseIndex,
                weightKg: weightInput,
                reps: repsInput,
                rpe: 8,
                setType: 'Working'
              })
            }
            className="sys-btn-primary w-full py-3.5 rounded font-hud font-bold text-sm sm:text-base tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <Swords className="w-4 h-4" />
            <span>[ COMPLETE SET {nextSetNum} ]</span>
          </button>

          {/* Compact Logged Sets Pill Row */}
          {activeExObj.sets.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              {activeExObj.sets.map((s) => (
                <div
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono-sys text-xs text-slate-200"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>
                    #{s.setNumber}: {s.weightKg}kg × {s.reps}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExerciseSet(activeDungeon.activeExerciseIndex, s.id)}
                    className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finish Workout Button */}
        <button
          type="button"
          onClick={completeDungeonRaid}
          className={`w-full py-3 rounded font-hud font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
            completedSetsAll >= totalSetsAll
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'border border-[var(--sys-border)] bg-slate-950 text-[var(--sys-accent)] hover:bg-[var(--sys-badge-bg)]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>
            FINISH WORKOUT & CLAIM XP ({completedSetsAll}/{totalSetsAll} TOTAL SETS)
          </span>
        </button>
      </div>
    );
  }

  // ============================================================================
  // TODAY'S SYSTEM DIRECTIVE VIEW (One Focused Workout Gate At A Time)
  // ============================================================================
  const selectedDungeon =
    dungeons.find((d) => d.dayCode === selectedDay) ?? dungeons[0];

  return (
    <div className="system-window p-5 sm:p-6 space-y-5">
      {/* Centered Header */}
      <div className="text-center space-y-2">
        <div className="inline-block px-5 py-1 border border-[var(--sys-border)] bg-[var(--sys-badge-bg)]">
          <h2 className="font-hud font-bold text-base sm:text-lg tracking-[0.26em] sys-text-glow uppercase">
            DUNGEON DIRECTIVE
          </h2>
        </div>
        <p className="font-mono-sys text-xs text-slate-400">
          187 CM • 80 KG V-TAPER & RELATIVE STRENGTH PROTOCOL
        </p>
        <div className="sys-divider" />
      </div>

      {/* Clean 6-Day Selector Bar (MON / TUE / WED / THU / FRI / BOSS) */}
      <div className="grid grid-cols-6 gap-1.5">
        {DAY_TABS.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = getTodayRecommendedDayCode() === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`py-2 rounded border font-hud font-bold text-xs tracking-wider uppercase transition cursor-pointer ${
                isSelected
                  ? 'border-[var(--sys-primary)] bg-[var(--sys-primary)] text-slate-950 shadow-[0_0_12px_var(--sys-glow)]'
                  : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white'
              }`}
            >
              <div>{day}</div>
              {isToday && (
                <div className="text-[9px] font-mono-sys leading-none mt-0.5 opacity-80">
                  TODAY
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Focused Single Gate Card */}
      <div className="p-4 sm:p-5 rounded bg-slate-950/80 border border-[var(--sys-border-subtle)] space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono-sys">
            <span className="text-[var(--sys-accent)] font-bold">
              {selectedDungeon.dayLabel} • {selectedDungeon.rank}
            </span>
            <span className="text-amber-300">+{selectedDungeon.xpReward} XP</span>
          </div>

          <h3 className="font-hud font-bold text-lg sm:text-xl text-white">
            {selectedDungeon.name}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedDungeon.description}
          </p>
        </div>

        {/* Clean 4-Exercise Preview List */}
        <div className="space-y-2 pt-1">
          {selectedDungeon.exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="flex items-center justify-between py-2 px-3 rounded bg-slate-900/75 border border-slate-800/90 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono-sys text-xs text-[var(--sys-accent)] font-bold">
                  0{idx + 1}
                </span>
                <div className="truncate">
                  <div className="font-hud font-semibold text-white truncate">
                    {ex.name}
                  </div>
                  {ex.cue && (
                    <div className="text-[11px] text-slate-400 truncate">{ex.cue}</div>
                  )}
                </div>
              </div>

              <span className="font-mono-sys text-xs text-[var(--sys-accent)] shrink-0 ml-2">
                {ex.targetSets} × {ex.targetReps}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => startDungeonRaid(selectedDungeon)}
          className="sys-btn-primary w-full py-3.5 rounded font-hud font-bold text-sm sm:text-base tracking-[0.22em] uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          <Dumbbell className="w-4 h-4" />
          <span>[ ENTER DUNGEON GATE ]</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
