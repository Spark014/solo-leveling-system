import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Flame, Share2, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PERMANENT_APP_URL = 'https://spark014.github.io/solo-leveling-system/';

export const SystemHeader: React.FC = () => {
  const {
    profile,
    userThemePreference,
    setUserThemePreference,
    soundEnabled,
    toggleSound,
    notifications,
    dismissNotification
  } = useSystem();

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  const toggleAura = () => {
    setUserThemePreference(userThemePreference === 'blue' ? 'purple' : 'blue');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(PERMANENT_APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--sys-border-subtle)] bg-[#02050b]/90 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Clean Hunter Rank + Level */}
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded border border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] font-hud font-bold text-xs tracking-widest sys-text-glow uppercase">
              {profile.rank === 'Shadow Monarch' ? 'MONARCH' : profile.rank}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-hud font-bold text-sm sm:text-base tracking-[0.16em] text-white">
                  LV.{profile.level}
                </span>
                <span className="text-xs font-mono-sys text-slate-400">
                  // {profile.heightCm}CM • {profile.bodyweightKg}KG
                </span>
              </div>
              <div className="w-28 sm:w-44 h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[var(--sys-primary)] transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Minimal Streak + Install/Share + Aura + Sound */}
          <div className="flex items-center gap-2">
            {profile.unallocatedPoints > 0 && (
              <span className="px-2 py-0.5 rounded bg-[var(--sys-badge-bg)] border border-[var(--sys-primary)] font-mono-sys text-xs text-[var(--sys-accent)]">
                +{profile.unallocatedPoints} AP
              </span>
            )}

            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono-sys text-slate-300">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>{profile.streakDays}D</span>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              title="Install App to Phone or Share with Friend"
              className="px-2.5 py-1 rounded border border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-xs font-hud font-bold uppercase tracking-wider text-[var(--sys-accent)] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>

            <button
              type="button"
              onClick={toggleAura}
              title="Toggle System Blue / Shadow Monarch Purple Aura"
              className="px-2.5 py-1 rounded bg-slate-950 border border-[var(--sys-border-subtle)] hover:border-[var(--sys-primary)] text-xs font-hud uppercase tracking-wider text-[var(--sys-accent)] flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {userThemePreference === 'purple' ? 'Monarch' : 'System'}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute System Chimes' : 'Enable System Chimes'}
              className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Install & Share With Friend System Window */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="system-window w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-hud font-bold text-base tracking-[0.22em] sys-text-glow uppercase">
                INSTALL APP & SHARE
              </h3>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="sys-divider" />

            <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
              <div className="p-3 rounded bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="font-hud font-bold text-[var(--sys-accent)] uppercase tracking-wider">
                  24/7 Permanent Cloud Link (Works When Mac Is Off)
                </div>
                <div className="font-mono-sys text-cyan-200 break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {PERMANENT_APP_URL}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="sys-btn-primary w-full py-2 rounded font-hud font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED LINK!' : 'COPY LINK FOR PHONE / FRIEND'}</span>
                </button>
              </div>

              <div className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="font-hud font-bold text-white uppercase">
                  1. Install on Samsung Galaxy Z Fold 5 / Android:
                </div>
                <p className="text-slate-300">
                  Open the link in <strong>Chrome</strong> or <strong>Samsung Internet</strong>, tap the menu (<strong>⋮</strong> or <strong>☰</strong>), and tap <strong>&ldquo;Install app&rdquo;</strong> / <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="font-hud font-bold text-white uppercase">
                  2. For Your Friend:
                </div>
                <p className="text-slate-300">
                  Send them the link above! Their progress saves privately to their own phone, and they can tap <strong>[EDIT]</strong> next to <code>187 CM • 80 KG</code> in the <strong>Status Window</strong> to calibrate their own height and weight.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Clean Floating System Notification Toast */}
      {notifications.length > 0 && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-md pointer-events-none">
          {notifications.slice(0, 1).map((n) => (
            <div
              key={n.id}
              className="pointer-events-auto system-window px-4 py-3 flex items-center justify-between gap-3"
            >
              <div>
                <div className="font-hud font-bold text-xs tracking-[0.2em] uppercase sys-text-glow">
                  {n.title}
                </div>
                <div className="text-xs text-slate-200 mt-0.5">{n.message}</div>
              </div>
              <button
                type="button"
                onClick={() => dismissNotification(n.id)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
