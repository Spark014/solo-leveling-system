import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { soundEngine } from '../utils/soundEngine';

const SPLIT_OPTIONS = [
  'Push / Pull / Legs (PPL)',
  'Upper / Lower Hypertrophy',
  'Arnold Split (Chest+Back / Shoulders+Arms / Legs)',
  'Solo Leveling Calisthenics & Conditioning',
  'Full Body Strength (3-4x/Week)'
];

export const AwakeningModal: React.FC = () => {
  const { profile, completeAwakening } = useSystem();
  const [step, setStep] = useState<'prompt' | 'calibrate'>('prompt');
  const [countdown, setCountdown] = useState<number>(5.0);
  const [name, setName] = useState<string>('SUNG JIN-WOO');
  const [bodyweightKg, setBodyweightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [preferredSplit, setPreferredSplit] = useState<string>(SPLIT_OPTIONS[0]);
  const [difficultyMultiplier, setDifficultyMultiplier] = useState<number>(1.0);

  useEffect(() => {
    if (profile.awakened || step !== 'prompt') return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.04) {
          clearInterval(timer);
          return 0.02; // Stops at the iconic 0.02 seconds from the anime!
        }
        return Number((prev - 0.09).toFixed(2));
      });
    }, 80);
    return () => clearInterval(timer);
  }, [profile.awakened, step]);

  if (profile.awakened) return null;

  const handleAccept = () => {
    soundEngine.playSystemOpen();
    setStep('calibrate');
  };

  const handleQuickStart = () => {
    completeAwakening({
      name: 'SUNG JIN-WOO',
      bodyweightKg: 75,
      heightCm: 178,
      preferredSplit: SPLIT_OPTIONS[0],
      difficultyMultiplier: 1.0
    });
  };

  const handleFinishCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    completeAwakening({
      name,
      bodyweightKg,
      heightCm,
      preferredSplit,
      difficultyMultiplier
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="system-window scanline-overlay w-full max-w-xl p-6 sm:p-8 border border-cyan-400/70 animate-fadeIn">
        {/* System Top Alert Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/40 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-500/15 text-cyan-300 font-bold">
              !
            </div>
            <span className="font-hud tracking-[0.22em] text-sm sm:text-base font-bold sys-text-glow uppercase">
              NOTIFICATION // SECRET QUEST: COURAGE OF THE WEAK
            </span>
          </div>
          <span className="font-mono-sys text-xs text-cyan-300/70">CARTENON TEMPLE</span>
        </div>

        {step === 'prompt' ? (
          <div className="space-y-6 text-center py-2">
            <div className="space-y-3">
              <p className="text-slate-200 text-lg sm:text-xl leading-relaxed font-medium">
                You have acquired the qualifications to be a{' '}
                <span className="sys-text-glow font-bold underline decoration-cyan-400/60 underline-offset-4">
                  Player
                </span>
                .
              </p>
              <p className="text-slate-300 text-base sm:text-lg">Will you accept?</p>
            </div>

            <div className="bg-red-950/35 border border-red-500/45 rounded px-4 py-3 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-red-300 text-xs sm:text-sm font-hud tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Your heart will stop if you do not accept in time</span>
              </div>
              <div className="font-mono-sys text-2xl sm:text-3xl font-bold text-red-400 mt-1 tracking-widest">
                00:0{countdown.toFixed(2)}s
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAccept}
                className="sys-btn-primary w-full sm:w-auto px-8 py-3.5 rounded font-hud font-bold tracking-[0.18em] text-sm sm:text-base uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span>[YES, I ACCEPT] — CALIBRATE VESSEL</span>
              </button>
              <button
                type="button"
                onClick={handleQuickStart}
                className="w-full sm:w-auto px-5 py-3.5 rounded border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/50 text-cyan-200 font-hud text-xs sm:text-sm tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>INSTANT AWAKEN (DEFAULT)</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinishCalibration} className="space-y-4">
            <div className="text-xs text-cyan-300/80 font-mono-sys uppercase tracking-wider">
              [SYSTEM] Calibrating Player Vessel for Samsung Galaxy Z Fold 5 Adaptive Interface...
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-hud uppercase tracking-wider text-slate-300 mb-1">
                  Hunter Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/90 border border-cyan-500/45 rounded px-3 py-2 text-sm font-mono-sys text-cyan-100 focus:outline-none focus:border-cyan-300"
                  placeholder="SUNG JIN-WOO"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-hud uppercase tracking-wider text-slate-300 mb-1">
                  Bodyweight (kg)
                </label>
                <input
                  type="number"
                  min={35}
                  max={250}
                  value={bodyweightKg}
                  onChange={(e) => setBodyweightKg(Number(e.target.value))}
                  className="w-full bg-slate-950/90 border border-cyan-500/45 rounded px-3 py-2 text-sm font-mono-sys text-cyan-100 focus:outline-none focus:border-cyan-300"
                />
              </div>

              <div>
                <label className="block text-xs font-hud uppercase tracking-wider text-slate-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min={120}
                  max={230}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-950/90 border border-cyan-500/45 rounded px-3 py-2 text-sm font-mono-sys text-cyan-100 focus:outline-none focus:border-cyan-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-hud uppercase tracking-wider text-slate-300 mb-1">
                Primary Dungeon Training Split
              </label>
              <select
                value={preferredSplit}
                onChange={(e) => setPreferredSplit(e.target.value)}
                className="w-full bg-slate-950/90 border border-cyan-500/45 rounded px-3 py-2.5 text-sm text-cyan-100 focus:outline-none focus:border-cyan-300"
              >
                {SPLIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-950">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-hud uppercase tracking-wider text-slate-300 mb-1.5">
                Daily Quest Intensity Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'E-Rank Starter (50 Reps / 5km)', mult: 0.5 },
                  { label: 'Anime Standard (100 Reps / 10km)', mult: 1.0 },
                  { label: 'S-Rank Brutal (150 Reps / 15km)', mult: 1.5 }
                ].map((tier) => (
                  <button
                    key={tier.mult}
                    type="button"
                    onClick={() => setDifficultyMultiplier(tier.mult)}
                    className={`p-2.5 rounded border text-left transition cursor-pointer ${
                      difficultyMultiplier === tier.mult
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                        : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="font-hud text-xs font-bold">{tier.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-cyan-500/30">
              <div className="flex items-center gap-2 text-xs text-cyan-300/80">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Includes 1x Free Purified Elixir of Life (Rest Day Shield)</span>
              </div>
              <button
                type="submit"
                className="sys-btn-primary px-6 py-2.5 rounded font-hud font-bold tracking-widest text-sm uppercase flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>ENTER THE SYSTEM</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
