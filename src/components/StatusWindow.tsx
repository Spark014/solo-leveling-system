import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { STRENGTH_STANDARDS_80KG } from '../data/systemDatabase';
import { useSystem } from '../context/SystemContext';
import { StatKey } from '../types/system';

const STAT_LABELS: { key: StatKey; label: string }[] = [
  { key: 'STR', label: 'STR' },
  { key: 'VIT', label: 'VIT' },
  { key: 'AGI', label: 'AGI' },
  { key: 'INT', label: 'INT' },
  { key: 'PER', label: 'PER' }
];

export const StatusWindow: React.FC = () => {
  const {
    profile,
    effectiveStats,
    titles,
    allocateStatPoint,
    equipTitle,
    completeAwakening
  } = useSystem();

  const [showTitles, setShowTitles] = useState(false);
  const [editingVessel, setEditingVessel] = useState(false);
  const [heightInput, setHeightInput] = useState(profile.heightCm);
  const [weightInput, setWeightInput] = useState(profile.bodyweightKg);

  const equippedTitle = titles.find((t) => t.id === profile.equippedTitleId) ?? titles[0];
  const bwScale = profile.bodyweightKg / 80;

  const getLiftRankBadge = (
    current1RM: number,
    std: (typeof STRENGTH_STANDARDS_80KG)[number]
  ) => {
    const eVal = Math.round(std.eRank * bwScale);
    const cVal = Math.round(std.cRank * bwScale);
    const aVal = Math.round(std.aRank * bwScale);
    const sVal = Math.round(std.sRank * bwScale);

    if (current1RM >= sVal)
      return { rank: 'S-RANK', next: sVal, sVal, color: 'text-purple-300 border-purple-400/50' };
    if (current1RM >= aVal)
      return { rank: 'A-RANK', next: sVal, sVal, color: 'text-amber-300 border-amber-400/50' };
    if (current1RM >= cVal)
      return { rank: 'C-RANK', next: aVal, sVal, color: 'text-cyan-300 border-cyan-400/50' };
    if (current1RM >= eVal)
      return { rank: 'D-RANK', next: cVal, sVal, color: 'text-emerald-300 border-emerald-400/50' };
    return { rank: 'E-RANK', next: eVal, sVal, color: 'text-slate-400 border-slate-700' };
  };

  const handleSaveVessel = (e: React.FormEvent) => {
    e.preventDefault();
    completeAwakening({
      name: `PLAYER // ${heightInput}CM • ${weightInput}KG`,
      heightCm: heightInput,
      bodyweightKg: weightInput,
      preferredSplit: profile.preferredSplit,
      difficultyMultiplier: 1.0
    });
    setEditingVessel(false);
  };

  return (
    <div className="system-window p-5 sm:p-6 space-y-6">
      {/* Authentic Anime Centered [ STATUS ] Header */}
      <div className="text-center space-y-2">
        <div className="inline-block px-6 py-1 border border-[var(--sys-border)] bg-[var(--sys-badge-bg)]">
          <h2 className="font-hud font-bold text-lg tracking-[0.32em] sys-text-glow uppercase">
            STATUS
          </h2>
        </div>
        <div className="sys-divider" />
      </div>

      {/* Level + Job + Title Block */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-4 text-center sm:border-r border-[var(--sys-border-subtle)] sm:pr-4">
          <div className="font-hud text-4xl sm:text-5xl font-bold text-white leading-none">
            {profile.level}
          </div>
          <div className="font-mono-sys text-xs tracking-[0.25em] text-[var(--sys-accent)] uppercase mt-1">
            LEVEL
          </div>
        </div>

        <div className="sm:col-span-8 space-y-2 text-xs sm:text-sm font-mono-sys">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">JOB:</span>
            <span className="text-white font-hud font-bold tracking-wider">{profile.job}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">TITLE:</span>
            <button
              type="button"
              onClick={() => setShowTitles((p) => !p)}
              className="text-[var(--sys-accent)] font-hud font-bold hover:underline cursor-pointer"
            >
              {equippedTitle.name}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">VESSEL:</span>
            <button
              type="button"
              onClick={() => setEditingVessel((p) => !p)}
              className="text-slate-200 hover:text-[var(--sys-accent)] underline decoration-slate-700 underline-offset-4 cursor-pointer"
            >
              {profile.heightCm} CM • {profile.bodyweightKg} KG [EDIT]
            </button>
          </div>
        </div>
      </div>

      {editingVessel && (
        <form
          onSubmit={handleSaveVessel}
          className="p-3 bg-slate-950/90 border border-[var(--sys-border)] rounded flex flex-wrap items-center justify-between gap-2 text-xs font-mono-sys"
        >
          <div className="flex items-center gap-2">
            <label className="text-slate-400">CM:</label>
            <input
              type="number"
              min={130}
              max={230}
              value={heightInput}
              onChange={(e) => setHeightInput(Number(e.target.value))}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
            />
            <label className="text-slate-400 ml-1">KG:</label>
            <input
              type="number"
              min={40}
              max={200}
              value={weightInput}
              onChange={(e) => setWeightInput(Number(e.target.value))}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
            />
          </div>
          <button
            type="submit"
            className="sys-btn-primary px-3 py-1 rounded font-hud font-bold uppercase cursor-pointer"
          >
            Save Vessel
          </button>
        </form>
      )}

      {showTitles && (
        <div className="p-3 bg-slate-950/90 border border-[var(--sys-border-subtle)] rounded space-y-1.5">
          {titles.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={!t.unlocked}
              onClick={() => {
                equipTitle(t.id);
                setShowTitles(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between ${
                t.id === profile.equippedTitleId
                  ? 'border border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-white'
                  : t.unlocked
                    ? 'hover:bg-slate-900 text-slate-300 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed text-slate-500'
              }`}
            >
              <span className="font-hud font-bold">{t.name}</span>
              <span className="font-mono-sys text-[11px] text-[var(--sys-accent)]">
                {t.bonusText}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="sys-divider" />

      {/* HP / MP / Fatigue Minimalist Row */}
      <div className="grid grid-cols-3 gap-4 text-center font-mono-sys">
        <div>
          <div className="text-[11px] text-slate-400">HP</div>
          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
            {profile.hp.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400">MP</div>
          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
            {profile.mp.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400">FATIGUE</div>
          <div className="text-sm sm:text-base font-bold text-[var(--sys-accent)] mt-0.5">
            {profile.fatigue}%
          </div>
        </div>
      </div>

      <div className="sys-divider" />

      {/* Authentic 2-Column Attribute Grid (STR, VIT, AGI, INT, PER + Available Points) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-center">
        {STAT_LABELS.map(({ key, label }) => {
          const val = effectiveStats[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between py-1.5 border-b border-slate-800/80"
            >
              <span className="font-hud font-bold text-sm tracking-widest text-slate-300">
                {label}:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-sys text-lg font-bold sys-text-glow">{val}</span>
                {profile.unallocatedPoints > 0 && (
                  <button
                    type="button"
                    onClick={() => allocateStatPoint(key, 1)}
                    className="w-6 h-6 rounded border border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-[var(--sys-accent)] flex items-center justify-center hover:bg-[var(--sys-primary)] hover:text-slate-950 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
          <span className="font-mono-sys text-xs text-slate-400 uppercase">
            Available Points:
          </span>
          <span className="font-mono-sys text-lg font-bold text-[var(--sys-accent)]">
            {profile.unallocatedPoints}
          </span>
        </div>
      </div>

      <div className="sys-divider" />

      {/* Bodyweight-Scaled Strength Rank Standards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-hud font-bold text-xs tracking-[0.2em] uppercase text-[var(--sys-accent)]">
            {profile.bodyweightKg} KG STRENGTH RANK BENCHMARKS (EST. 1RM)
          </span>
          <span className="font-mono-sys text-[11px] text-slate-400">E → C → A → S</span>
        </div>

        <div className="space-y-2.5">
          {STRENGTH_STANDARDS_80KG.map((std) => {
            const current = profile.personalRecords[std.exerciseId] ?? 0;
            const badge = getLiftRankBadge(current, std);
            const pct = Math.min(100, Math.round((current / badge.sVal) * 100));

            return (
              <div key={std.exerciseId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-hud font-semibold text-slate-200">{std.label}</span>
                  <div className="flex items-center gap-2 font-mono-sys">
                    <span className="text-white font-bold">{current} kg</span>
                    <span className="text-slate-500">/ Next: {badge.next} kg</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${badge.color}`}>
                      {badge.rank}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--sys-secondary)] to-[var(--sys-primary)] transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
