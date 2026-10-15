import React, { useState } from 'react';
import { ClipboardCheck, Crown, Dumbbell, Shield } from 'lucide-react';
import { DailyQuestPanel } from './components/DailyQuestPanel';
import { DungeonRaidTracker } from './components/DungeonRaidTracker';
import { ShadowArmyPanel } from './components/ShadowArmyPanel';
import { StatusWindow } from './components/StatusWindow';
import { SystemHeader } from './components/SystemHeader';
import { SystemProvider, useSystem } from './context/SystemContext';
import { soundEngine } from './utils/soundEngine';

type MobileTab = 'workout' | 'daily' | 'status' | 'shadows';
type LeftTab = 'status' | 'shadows';
type RightTab = 'workout' | 'daily';

const SystemShell: React.FC = () => {
  const { resolvedPosture, activeDungeon, profile } = useSystem();

  const [mobileTab, setMobileTab] = useState<MobileTab>('workout');
  const [leftTab, setLeftTab] = useState<LeftTab>('status');
  const [rightTab, setRightTab] = useState<RightTab>('workout');

  const hasUnclaimedDaily =
    profile.dailyQuestCompletedToday && !profile.dailyRewardsClaimedToday;

  return (
    <div className="min-h-dvh flex flex-col pb-20 md:pb-8">
      <SystemHeader />

      {/* ==================================================================== */}
      {/* COVER SCREEN / MOBILE (< 768px): Strictly ONE Floating Window        */}
      {/* ==================================================================== */}
      {resolvedPosture === 'cover' ? (
        <main className="flex-1 w-full max-w-md mx-auto px-3 pt-4">
          {mobileTab === 'workout' && <DungeonRaidTracker />}
          {mobileTab === 'daily' && <DailyQuestPanel />}
          {mobileTab === 'status' && <StatusWindow />}
          {mobileTab === 'shadows' && <ShadowArmyPanel />}

          {/* Clean 4-Tab Bottom Dock */}
          <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--sys-border-subtle)] bg-[#02050b]/95 backdrop-blur-xl px-3 py-2">
            <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
              {[
                {
                  id: 'workout' as MobileTab,
                  label: activeDungeon ? 'Active Raid' : 'Workout',
                  icon: <Dumbbell className="w-4 h-4" />
                },
                {
                  id: 'daily' as MobileTab,
                  label: hasUnclaimedDaily ? 'Daily (!)' : 'Daily Quest',
                  icon: <ClipboardCheck className="w-4 h-4" />
                },
                {
                  id: 'status' as MobileTab,
                  label: 'Status',
                  icon: <Shield className="w-4 h-4" />
                },
                {
                  id: 'shadows' as MobileTab,
                  label: 'Shadows',
                  icon: <Crown className="w-4 h-4" />
                }
              ].map((item) => {
                const active = mobileTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTick();
                      setMobileTab(item.id);
                    }}
                    className={`flex flex-col items-center justify-center py-2 rounded transition cursor-pointer ${
                      active
                        ? 'bg-[var(--sys-badge-bg)] border border-[var(--sys-primary)] text-[var(--sys-accent)] font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px] font-hud uppercase tracking-wider mt-1">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </main>
      ) : (
        /* ==================================================================== */
        /* UNFOLDED Z FOLD 5 MAIN SCREEN (>= 768px): Two Clean Side-by-Side     */
        /* Floating Windows (Never Stacked 2-Deep!)                             */
        /* ==================================================================== */
        <main className="flex-1 w-full max-w-5xl mx-auto px-5 pt-6">
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* LEFT PANE: Status Window OR Shadow Army */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTick();
                    setLeftTab('status');
                  }}
                  className={`py-2 rounded border font-hud font-bold text-xs tracking-[0.2em] uppercase transition cursor-pointer ${
                    leftTab === 'status'
                      ? 'border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-[var(--sys-accent)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  [ STATUS WINDOW ]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTick();
                    setLeftTab('shadows');
                  }}
                  className={`py-2 rounded border font-hud font-bold text-xs tracking-[0.2em] uppercase transition cursor-pointer ${
                    leftTab === 'shadows'
                      ? 'border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-[var(--sys-accent)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  [ SHADOW ARMY ]
                </button>
              </div>

              {leftTab === 'status' ? <StatusWindow /> : <ShadowArmyPanel />}
            </div>

            {/* RIGHT PANE: Today's Workout Gate OR Daily Quest */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTick();
                    setRightTab('workout');
                  }}
                  className={`py-2 rounded border font-hud font-bold text-xs tracking-[0.2em] uppercase transition cursor-pointer ${
                    rightTab === 'workout'
                      ? 'border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-[var(--sys-accent)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {activeDungeon ? '[ ACTIVE RAID ]' : '[ TODAY’S WORKOUT ]'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTick();
                    setRightTab('daily');
                  }}
                  className={`py-2 rounded border font-hud font-bold text-xs tracking-[0.2em] uppercase transition cursor-pointer ${
                    rightTab === 'daily'
                      ? 'border-[var(--sys-primary)] bg-[var(--sys-badge-bg)] text-[var(--sys-accent)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {hasUnclaimedDaily ? '[ DAILY QUEST ! ]' : '[ DAILY QUEST ]'}
                </button>
              </div>

              {rightTab === 'workout' ? <DungeonRaidTracker /> : <DailyQuestPanel />}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SystemProvider>
      <SystemShell />
    </SystemProvider>
  );
};

export default App;
