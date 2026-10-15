import React, { useState } from 'react';
import {
  Coins,
  Crown,
  Download,
  FlaskConical,
  History,
  PackageOpen,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Swords,
  Upload
} from 'lucide-react';
import { SYSTEM_SHOP_ITEMS } from '../data/systemDatabase';
import { useSystem } from '../context/SystemContext';

export const SystemShopAndArchitect: React.FC = () => {
  const {
    profile,
    workoutHistory,
    buyShopItem,
    useElixirOfLife,
    exportSaveData,
    importSaveData,
    resetHunterSystem
  } = useSystem();

  const [importText, setImportText] = useState('');
  const [showBackupPanel, setShowBackupPanel] = useState(false);

  const elixirCount = profile.inventory['item-elixir'] ?? 0;

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-emerald-400" />;
      case 'PackageOpen':
        return <PackageOpen className="w-5 h-5 text-amber-400" />;
      case 'Swords':
        return <Swords className="w-5 h-5 text-rose-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleDownloadBackup = () => {
    const data = exportSaveData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hunter-system-fold5-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const ok = importSaveData(importText);
    if (ok) {
      setImportText('');
      setShowBackupPanel(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* System Gold Shop & Inventory */}
      <div className="system-window scanline-overlay p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--sys-border)] pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-hud font-bold text-base sm:text-lg tracking-[0.2em] sys-text-glow uppercase">
                SYSTEM STORE & HUNTER INVENTORY
              </h2>
              <p className="text-[11px] font-mono-sys text-slate-400">
                EXCHANGE DUNGEON GOLD FOR ELIXIRS, ARTIFACTS & MONARCH AWAKENINGS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/15 border border-amber-400/50 text-amber-200 font-mono-sys text-xs font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.gold.toLocaleString()} GOLD</span>
            </div>
            {elixirCount > 0 && (
              <button
                type="button"
                onClick={useElixirOfLife}
                className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 font-hud font-bold text-xs uppercase cursor-pointer"
              >
                Use Elixir ({elixirCount}x Owned)
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SYSTEM_SHOP_ITEMS.map((item) => {
            const canAfford = profile.gold >= item.costGold;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-md border border-[var(--sys-border-subtle)] bg-slate-950/75 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        {getItemIcon(item.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-sys uppercase text-slate-400">
                          {item.category}
                        </span>
                        <h3 className="font-hud font-bold text-sm text-white">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono-sys text-xs font-bold text-amber-300 shrink-0">
                      {item.costGold.toLocaleString()}G
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  <div className="text-[11px] font-mono-sys text-[var(--sys-accent)]">
                    Effect: {item.effectText}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => buyShopItem(item.id)}
                  className="sys-btn-primary w-full py-2 px-3 rounded font-hud font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {canAfford ? `PURCHASE (${item.costGold}G)` : `INSUFFICIENT GOLD (${item.costGold}G)`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dungeon Raid Combat History & Backup */}
      <div className="system-window scanline-overlay p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--sys-border)] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--sys-primary)]" />
            <div>
              <h2 className="font-hud font-bold text-sm sm:text-base tracking-[0.2em] sys-text-glow uppercase">
                DUNGEON CHRONICLES & SYSTEM MEMORY
              </h2>
              <p className="text-[11px] font-mono-sys text-slate-400">
                COMPLETED RAID LOGS & OFFLINE JSON BACKUP FOR GALAXY Z FOLD 5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--sys-border)] bg-slate-900 text-xs font-mono-sys text-cyan-200 hover:bg-cyan-950/50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setShowBackupPanel((p) => !p)}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-700 bg-slate-900 text-xs font-mono-sys text-slate-300 hover:text-white cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import / Reset</span>
            </button>
          </div>
        </div>

        {showBackupPanel && (
          <div className="bg-slate-950/90 border border-[var(--sys-border)] rounded p-3 space-y-3">
            <form onSubmit={handleImportSubmit} className="space-y-2">
              <label className="block text-xs font-mono-sys text-slate-300">
                Paste exported System JSON to restore Hunter Profile:
              </label>
              <textarea
                rows={3}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"profile": ...}'
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono-sys text-cyan-100"
              />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="sys-btn-primary px-3 py-1.5 rounded font-hud font-bold text-xs uppercase cursor-pointer"
                >
                  Restore Memory
                </button>
                <button
                  type="button"
                  onClick={resetHunterSystem}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-rose-500/50 bg-rose-950/40 text-rose-300 text-xs font-hud uppercase cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Awaken (Factory Reset)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {workoutHistory.length === 0 ? (
          <div className="text-center py-6 text-xs font-mono-sys text-slate-400">
            No Dungeon Gates cleared yet. Enter a Gate in the Dungeon Portal to record your first raid!
          </div>
        ) : (
          <div className="space-y-2">
            {workoutHistory.slice(0, 8).map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded border border-slate-800 bg-slate-950/75 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-hud font-bold text-white text-sm">
                    {rec.dungeonName}{' '}
                    <span className="text-[11px] font-mono-sys text-cyan-300">
                      ({rec.rank})
                    </span>
                  </div>
                  <div className="font-mono-sys text-[11px] text-slate-400">
                    Boss: {rec.bossName} • {rec.setsCompleted} sets •{' '}
                    {rec.totalVolumeKg.toLocaleString()} kg volume • {rec.prsHit} PRs
                  </div>
                </div>
                <div className="text-right font-mono-sys">
                  <div className="text-emerald-300 font-bold">
                    +{rec.xpEarned} XP / +{rec.goldEarned}G
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(rec.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
