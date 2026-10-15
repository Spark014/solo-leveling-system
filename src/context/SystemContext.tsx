import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  calculateRankForLevel,
  DEFAULT_HUNTER_PROFILE,
  DUNGEON_TEMPLATES,
  HUNTER_TITLES,
  INITIAL_DAILY_QUESTS,
  INITIAL_SHADOW_ARMY,
  SYSTEM_SHOP_ITEMS
} from '../data/systemDatabase';
import {
  ActiveDungeonSession,
  CompletedWorkoutRecord,
  CoreStats,
  DailyQuestItem,
  DungeonTemplate,
  FoldPosture,
  HunterProfile,
  HunterTitle,
  MuscleFatigueState,
  MuscleGroup,
  ShadowSoldier,
  StatKey,
  SystemNotification,
  SystemTheme
} from '../types/system';
import { soundEngine } from '../utils/soundEngine';
import {
  calculateEstimated1RM,
  computeCurrentMuscleRecovery,
  generateAdaptiveInstantDungeon,
  initializeMuscleFatigue
} from '../utils/systemArchitect';

interface AriseCandidate {
  shadow: ShadowSoldier;
  attemptsLeft: number;
  reason: string;
}

interface SystemContextValue {
  profile: HunterProfile;
  effectiveStats: CoreStats;
  dailyQuests: DailyQuestItem[];
  dungeons: DungeonTemplate[];
  activeDungeon: ActiveDungeonSession | null;
  workoutHistory: CompletedWorkoutRecord[];
  shadows: ShadowSoldier[];
  titles: HunterTitle[];
  muscleFatigue: Record<MuscleGroup, MuscleFatigueState>;
  notifications: SystemNotification[];
  ariseCandidate: AriseCandidate | null;
  theme: SystemTheme;
  userThemePreference: SystemTheme;
  foldPostureSetting: FoldPosture;
  resolvedPosture: 'cover' | 'unfolded' | 'flex';
  soundEnabled: boolean;
  completeAwakening: (params: {
    name: string;
    bodyweightKg: number;
    heightCm: number;
    preferredSplit: string;
    difficultyMultiplier: number;
  }) => void;
  setFoldPostureSetting: (posture: FoldPosture) => void;
  setUserThemePreference: (theme: SystemTheme) => void;
  toggleSound: () => void;
  allocateStatPoint: (stat: StatKey, amount?: number) => void;
  equipTitle: (titleId: string) => void;
  incrementDailyQuest: (questId: string, delta: number) => void;
  updateDailyQuestTarget: (questId: string, newTarget: number) => void;
  claimDailyRewards: () => void;
  claimSecretDailyReward: () => void;
  triggerPenaltySimulation: () => void;
  completePenaltyReps: (reps: number) => void;
  useElixirOfLife: () => void;
  addHydration: (ml: number) => void;
  addProtein: (grams: number) => void;
  startDungeonRaid: (dungeon: DungeonTemplate) => void;
  startArchitectInstantDungeon: () => void;
  createCustomDungeon: (dungeon: DungeonTemplate) => void;
  selectActiveExercise: (index: number) => void;
  logExerciseSet: (params: {
    exerciseIndex: number;
    weightKg: number;
    reps: number;
    rpe: number;
    setType: 'Warmup' | 'Working' | 'PR Attempt' | 'Drop Set';
  }) => void;
  deleteExerciseSet: (exerciseIndex: number, setId: string) => void;
  startRestTimer: (seconds: number) => void;
  skipRestTimer: () => void;
  completeDungeonRaid: () => void;
  abandonDungeonRaid: () => void;
  attemptShadowExtraction: () => { success: boolean; message: string };
  dismissAriseModal: () => void;
  upgradeShadow: (shadowId: string) => void;
  buyShopItem: (itemId: string) => void;
  dismissNotification: (id: string) => void;
  exportSaveData: () => string;
  importSaveData: (jsonString: string) => boolean;
  resetHunterSystem: () => void;
}

const STORAGE_KEY = 'SOLO_LEVELING_187_80_V2';

const SystemContext = createContext<SystemContextValue | null>(null);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<HunterProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profile) {
          return {
            ...DEFAULT_HUNTER_PROFILE,
            ...parsed.profile,
            awakened: true
          };
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_HUNTER_PROFILE;
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuestItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.dailyQuests) return parsed.dailyQuests;
      }
    } catch {
      // ignore
    }
    return INITIAL_DAILY_QUESTS;
  });

  const [customDungeons, setCustomDungeons] = useState<DungeonTemplate[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.customDungeons) return parsed.customDungeons;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeDungeon, setActiveDungeon] = useState<ActiveDungeonSession | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.activeDungeon) return parsed.activeDungeon;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkoutRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.workoutHistory) return parsed.workoutHistory;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [shadows, setShadows] = useState<ShadowSoldier[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.shadows) return parsed.shadows;
      }
    } catch {
      // ignore
    }
    return INITIAL_SHADOW_ARMY;
  });

  const [titles, setTitles] = useState<HunterTitle[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.titles) return parsed.titles;
      }
    } catch {
      // ignore
    }
    return HUNTER_TITLES;
  });

  const [muscleFatigue, setMuscleFatigue] = useState<Record<MuscleGroup, MuscleFatigueState>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.muscleFatigue) return computeCurrentMuscleRecovery(parsed.muscleFatigue);
      }
    } catch {
      // ignore
    }
    return initializeMuscleFatigue();
  });

  const [userThemePreference, setUserThemePreference] = useState<SystemTheme>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.userThemePreference) return parsed.userThemePreference;
      }
    } catch {
      // ignore
    }
    return 'blue';
  });

  const [foldPostureSetting, setFoldPostureSetting] = useState<FoldPosture>('auto');
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 820
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [ariseCandidate, setAriseCandidate] = useState<AriseCandidate | null>(null);

  const pushNotification = (
    title: string,
    message: string,
    type: SystemNotification['type'] = 'info'
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setNotifications((prev) => [{ id, title, message, type, timestamp: Date.now() }, ...prev.slice(0, 2)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Auto-dismiss notifications after 4.5s so they never clutter the screen
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(0, -1));
    }, 4500);
    return () => clearTimeout(timer);
  }, [notifications]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          dailyQuests,
          customDungeons,
          activeDungeon,
          workoutHistory,
          shadows,
          titles,
          muscleFatigue,
          userThemePreference
        })
      );
    } catch {
      // ignore
    }
  }, [
    profile,
    dailyQuests,
    customDungeons,
    activeDungeon,
    workoutHistory,
    shadows,
    titles,
    muscleFatigue,
    userThemePreference
  ]);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const resolvedPosture: 'cover' | 'unfolded' | 'flex' = useMemo(() => {
    if (foldPostureSetting !== 'auto') return foldPostureSetting;
    return viewportWidth < 768 ? 'cover' : 'unfolded';
  }, [foldPostureSetting, viewportWidth]);

  const theme: SystemTheme = useMemo(() => {
    if (
      profile.penaltyZoneActive ||
      activeDungeon?.dungeon.gateType === 'Red Gate' ||
      activeDungeon?.dungeon.gateType === 'Job Change Boss'
    ) {
      return 'red';
    }
    return userThemePreference;
  }, [profile.penaltyZoneActive, activeDungeon?.dungeon.gateType, userThemePreference]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Active Rest Timer interval
  useEffect(() => {
    if (!activeDungeon?.restTimerRunning) return;
    const interval = setInterval(() => {
      setActiveDungeon((prev) => {
        if (!prev || !prev.restTimerRunning) return prev;
        if (prev.restTimerSeconds <= 1) {
          soundEngine.playSystemOpen();
          return { ...prev, restTimerSeconds: 0, restTimerRunning: false };
        }
        return { ...prev, restTimerSeconds: prev.restTimerSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeDungeon?.restTimerRunning]);

  // Daily midnight check
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (profile.lastDailyResetDate !== today) {
      const missedYesterday = !profile.dailyQuestCompletedToday && !profile.restDayShieldActive;
      setDailyQuests((prev) => prev.map((q) => ({ ...q, current: 0 })));
      setProfile((prev) => ({
        ...prev,
        lastDailyResetDate: today,
        dailyQuestCompletedToday: false,
        dailyRewardsClaimedToday: false,
        secretQuestClaimedToday: false,
        restDayShieldActive: false,
        hydrationMl: 0,
        proteinGrams: 0,
        fatigue: Math.max(0, prev.fatigue - 30),
        streakDays: missedYesterday ? 0 : prev.streakDays,
        penaltyZoneActive: missedYesterday ? true : prev.penaltyZoneActive,
        penaltyRepsRemaining: missedYesterday ? 100 : prev.penaltyRepsRemaining
      }));
    }
  }, [profile.lastDailyResetDate, profile.dailyQuestCompletedToday, profile.restDayShieldActive]);

  const effectiveStats: CoreStats = useMemo(() => {
    const result: CoreStats = { ...profile.stats };
    const equippedTitle = titles.find((t) => t.id === profile.equippedTitleId);
    if (equippedTitle?.statBoost) {
      (Object.keys(equippedTitle.statBoost) as StatKey[]).forEach((k) => {
        result[k] += equippedTitle.statBoost[k] ?? 0;
      });
    }
    shadows
      .filter((s) => s.unlocked)
      .forEach((s) => {
        result[s.statBonusKey] += s.statBonusValue + (s.level - 1) * 2;
      });
    return result;
  }, [profile.stats, profile.equippedTitleId, titles, shadows]);

  const grantXpAndGold = (
    rawXp: number,
    goldDelta: number,
    statGains?: Partial<CoreStats>
  ) => {
    const shadowXpBonus = shadows
      .filter((s) => s.unlocked)
      .reduce((acc, s) => acc + s.xpMultiplierBonus, 0);
    const totalXpGain = Math.round(rawXp * (1 + shadowXpBonus));

    setProfile((prev) => {
      let level = prev.level;
      let xp = prev.xp + totalXpGain;
      let xpToNext = prev.xpToNextLevel;
      let unallocated = prev.unallocatedPoints;
      let leveledUp = false;

      while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        xpToNext = Math.round(300 * Math.pow(1.18, level - 1));
        unallocated += 5;
        leveledUp = true;
      }

      const newStats = { ...prev.stats };
      if (statGains) {
        (Object.keys(statGains) as StatKey[]).forEach((k) => {
          newStats[k] += statGains[k] ?? 0;
        });
      }

      const newRank = calculateRankForLevel(level, prev.shadowMonarchUnlocked);
      const maxHp = 1200 + newStats.VIT * 25 + level * 60;
      const maxMp = 250 + newStats.INT * 20 + level * 25;

      if (leveledUp) {
        soundEngine.playLevelUp();
        pushNotification(
          '[LEVEL UP!]',
          `Reached Level ${level} (${newRank}). +5 Ability Points acquired.`,
          'levelup'
        );
      }

      return {
        ...prev,
        level,
        xp,
        xpToNextLevel: xpToNext,
        unallocatedPoints: unallocated,
        rank: newRank,
        stats: newStats,
        maxHp,
        hp: leveledUp ? maxHp : Math.min(maxHp, prev.hp + 120),
        maxMp,
        mp: leveledUp ? maxMp : Math.min(maxMp, prev.mp + 40),
        gold: Math.max(0, prev.gold + goldDelta)
      };
    });
  };

  const completeAwakening = (params: {
    name: string;
    bodyweightKg: number;
    heightCm: number;
    preferredSplit: string;
    difficultyMultiplier: number;
  }) => {
    soundEngine.playSystemOpen();
    const bw = Math.max(40, Math.min(200, Number(params.bodyweightKg) || 80));
    const ht = Math.max(130, Math.min(230, Number(params.heightCm) || 187));
    setProfile((prev) => ({
      ...prev,
      name: params.name.trim().toUpperCase() || prev.name,
      bodyweightKg: bw,
      heightCm: ht,
      proteinTargetGrams: Math.round(bw * 2.2),
      hydrationTargetMl: Math.round(bw * 40)
    }));
    pushNotification(
      '[VESSEL RECALIBRATED]',
      `System calibrated for ${ht}cm / ${bw}kg (${Math.round(bw * 2.2)}g Protein target).`,
      'info'
    );
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.enabled = next;
      if (next) soundEngine.playTick();
      return next;
    });
  };

  const allocateStatPoint = (stat: StatKey, amount = 1) => {
    if (profile.unallocatedPoints < amount) return;
    soundEngine.playTick(1.15);
    setProfile((prev) => {
      if (prev.unallocatedPoints < amount) return prev;
      const nextStats = { ...prev.stats, [stat]: prev.stats[stat] + amount };
      const maxHp = 1200 + nextStats.VIT * 25 + prev.level * 60;
      const maxMp = 250 + nextStats.INT * 20 + prev.level * 25;
      return {
        ...prev,
        unallocatedPoints: prev.unallocatedPoints - amount,
        stats: nextStats,
        maxHp,
        hp: stat === 'VIT' ? prev.hp + amount * 25 : prev.hp,
        maxMp,
        mp: stat === 'INT' ? prev.mp + amount * 20 : prev.mp
      };
    });
  };

  const equipTitle = (titleId: string) => {
    const found = titles.find((t) => t.id === titleId && t.unlocked);
    if (!found) return;
    soundEngine.playSystemOpen();
    setProfile((prev) => ({ ...prev, equippedTitleId: titleId }));
  };

  const incrementDailyQuest = (questId: string, delta: number) => {
    soundEngine.playTick();
    let newlyCompletedAll = false;

    setDailyQuests((prev) => {
      const next = prev.map((q) => {
        if (q.id !== questId) return q;
        const updatedCurrent = Math.max(0, Math.min(q.secretTarget, q.current + delta));
        return { ...q, current: updatedCurrent };
      });

      const allMet = next.every((q) => q.current >= q.target);
      if (allMet && !profile.dailyQuestCompletedToday) {
        newlyCompletedAll = true;
      }
      return next;
    });

    if (newlyCompletedAll) {
      soundEngine.playLevelUp();
      setProfile((prev) => ({
        ...prev,
        dailyQuestCompletedToday: true,
        streakDays: prev.streakDays + 1
      }));
      pushNotification(
        '[DAILY QUEST COMPLETE]',
        'Goal reached! Open the Rewards prompt to claim your 3 System Rewards.',
        'levelup'
      );
    }
  };

  // Canonical 3-part Solo Leveling Daily Quest Reward!
  const claimDailyRewards = () => {
    if (!profile.dailyQuestCompletedToday || profile.dailyRewardsClaimedToday) return;
    soundEngine.playLevelUp();
    setProfile((prev) => ({
      ...prev,
      dailyRewardsClaimedToday: true,
      unallocatedPoints: prev.unallocatedPoints + 3,
      fatigue: 0,
      hp: prev.maxHp,
      mp: prev.maxMp
    }));
    grantXpAndGold(350, 500, { VIT: 1, STR: 1 });

    const kaisel = shadows.find((s) => s.id === 'shadow-kaisel');
    if (kaisel && !kaisel.unlocked) {
      setAriseCandidate({
        shadow: kaisel,
        attemptsLeft: 3,
        reason: 'Blessed Random Box opened — Shadow Wyvern Kaisel awaits extraction!'
      });
    } else {
      pushNotification(
        '[REWARDS CLAIMED]',
        '1) Full Status Recovery (0% Fatigue) • 2) +3 Stat Points • 3) Blessed Box (+350 XP)',
        'levelup'
      );
    }
  };

  const updateDailyQuestTarget = (questId: string, newTarget: number) => {
    const clean = Math.max(1, Math.round(newTarget));
    setDailyQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, target: clean, secretTarget: clean * 2 } : q
      )
    );
  };

  const claimSecretDailyReward = () => {
    const allSecretMet = dailyQuests.every((q) => q.current >= q.secretTarget);
    if (!allSecretMet || profile.secretQuestClaimedToday) return;

    soundEngine.playArise();
    setProfile((prev) => ({
      ...prev,
      secretQuestClaimedToday: true,
      unallocatedPoints: prev.unallocatedPoints + 5
    }));
    setTitles((prev) =>
      prev.map((t) => (t.id === 'title-adversity' ? { ...t, unlocked: true } : t))
    );
    grantXpAndGold(650, 1200, { STR: 2, AGI: 2, VIT: 2 });
    pushNotification(
      '[HIDDEN QUEST CLEARED: 200%]',
      '+5 Stat Points, +650 XP & Title: "One Who Overcame Adversity" unlocked!',
      'arise'
    );
  };

  const triggerPenaltySimulation = () => {
    soundEngine.playPenaltyAlarm();
    setProfile((prev) => ({
      ...prev,
      penaltyZoneActive: true,
      penaltyRepsRemaining: 100
    }));
  };

  const completePenaltyReps = (reps: number) => {
    soundEngine.playBossHit(false);
    setProfile((prev) => {
      const remaining = Math.max(0, prev.penaltyRepsRemaining - reps);
      const cleared = remaining === 0;
      if (cleared) {
        soundEngine.playLevelUp();
        setTitles((tPrev) =>
          tPrev.map((t) => (t.id === 'title-adversity' ? { ...t, unlocked: true } : t))
        );
      }
      return {
        ...prev,
        penaltyRepsRemaining: remaining,
        penaltyZoneActive: !cleared,
        stats: cleared ? { ...prev.stats, VIT: prev.stats.VIT + 2 } : prev.stats
      };
    });
  };

  const useElixirOfLife = () => {
    const count = profile.inventory['item-elixir'] ?? 0;
    if (count <= 0) return;
    soundEngine.playLevelUp();
    setProfile((prev) => ({
      ...prev,
      restDayShieldActive: true,
      penaltyZoneActive: false,
      penaltyRepsRemaining: 0,
      fatigue: 0,
      hp: prev.maxHp,
      mp: prev.maxMp,
      inventory: {
        ...prev.inventory,
        'item-elixir': Math.max(0, (prev.inventory['item-elixir'] ?? 1) - 1)
      }
    }));
  };

  const addHydration = (ml: number) => {
    soundEngine.playTick(1.2);
    setProfile((prev) => ({
      ...prev,
      hydrationMl: Math.min(6000, Math.max(0, prev.hydrationMl + ml))
    }));
  };

  const addProtein = (grams: number) => {
    soundEngine.playTick(1.1);
    setProfile((prev) => ({
      ...prev,
      proteinGrams: Math.min(350, Math.max(0, prev.proteinGrams + grams))
    }));
  };

  const startDungeonRaid = (dungeon: DungeonTemplate) => {
    soundEngine.playSystemOpen();
    const estimatedTotalVolume = dungeon.exercises.reduce((sum, ex) => {
      const avgReps = parseInt(ex.targetReps.split('-')[0], 10) || 10;
      return sum + ex.targetSets * avgReps * ex.suggestedWeightKg;
    }, 0);

    const bossMaxHp = Math.max(1200, Math.round(estimatedTotalVolume * 0.9));

    setActiveDungeon({
      id: `raid-${Date.now()}`,
      dungeon,
      startedAt: Date.now(),
      bossMaxHp,
      bossCurrentHp: bossMaxHp,
      activeExerciseIndex: 0,
      exercises: dungeon.exercises.map((ex) => ({
        template: ex,
        sets: []
      })),
      restTimerSeconds: 0,
      restTimerRunning: false,
      totalVolumeKg: 0,
      prsHit: 0
    });
  };

  const startArchitectInstantDungeon = () => {
    const instantGate = generateAdaptiveInstantDungeon(profile, muscleFatigue);
    startDungeonRaid(instantGate);
  };

  const createCustomDungeon = (dungeon: DungeonTemplate) => {
    setCustomDungeons((prev) => [dungeon, ...prev]);
  };

  const selectActiveExercise = (index: number) => {
    soundEngine.playTick();
    setActiveDungeon((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        activeExerciseIndex: Math.max(0, Math.min(prev.exercises.length - 1, index))
      };
    });
  };

  const logExerciseSet = (params: {
    exerciseIndex: number;
    weightKg: number;
    reps: number;
    rpe: number;
    setType: 'Warmup' | 'Working' | 'PR Attempt' | 'Drop Set';
  }) => {
    if (!activeDungeon) return;
    const exerciseEntry = activeDungeon.exercises[params.exerciseIndex];
    if (!exerciseEntry) return;

    const exId = exerciseEntry.template.id;
    const est1RM = calculateEstimated1RM(params.weightKg, params.reps);
    const previousBest1RM = profile.personalRecords[exId] ?? 0;
    const isPersonalRecord =
      params.setType !== 'Warmup' && est1RM > previousBest1RM && params.weightKg > 0;

    const rawVolume = Math.max(10, params.weightKg * params.reps);
    const critMultiplier = isPersonalRecord ? 1.4 : 1.0;
    const damageDealt = Math.round(rawVolume * critMultiplier);

    soundEngine.playBossHit(isPersonalRecord);

    const newSet = {
      id: `set-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      setNumber: exerciseEntry.sets.length + 1,
      weightKg: params.weightKg,
      reps: params.reps,
      rpe: params.rpe,
      setType: params.setType,
      completed: true,
      isPersonalRecord,
      estimated1RM: est1RM,
      damageDealt,
      timestamp: Date.now()
    };

    setActiveDungeon((prev) => {
      if (!prev) return null;
      const nextExercises = prev.exercises.map((item, idx) =>
        idx === params.exerciseIndex ? { ...item, sets: [...item.sets, newSet] } : item
      );
      const updatedSetCount = nextExercises[params.exerciseIndex].sets.length;
      const targetSets = nextExercises[params.exerciseIndex].template.targetSets;

      // Auto-advance to the next incomplete exercise when all target sets are done!
      let nextActiveIdx = prev.activeExerciseIndex;
      if (updatedSetCount >= targetSets && prev.activeExerciseIndex < nextExercises.length - 1) {
        nextActiveIdx = prev.activeExerciseIndex + 1;
      }

      return {
        ...prev,
        bossCurrentHp: Math.max(0, prev.bossCurrentHp - damageDealt),
        exercises: nextExercises,
        activeExerciseIndex: nextActiveIdx,
        totalVolumeKg: prev.totalVolumeKg + rawVolume,
        prsHit: prev.prsHit + (isPersonalRecord ? 1 : 0),
        restTimerSeconds: exerciseEntry.template.isCompound ? 90 : 60,
        restTimerRunning: true
      };
    });

    if (isPersonalRecord) {
      setProfile((prev) => ({
        ...prev,
        personalRecords: {
          ...prev.personalRecords,
          [exId]: est1RM
        }
      }));
      pushNotification(
        `[NEW PR: ${est1RM} KG 1RM]`,
        `${exerciseEntry.template.name} surged to an estimated ${est1RM} kg 1RM!`,
        'pr'
      );
    }
  };

  const deleteExerciseSet = (exerciseIndex: number, setId: string) => {
    soundEngine.playTick(0.8);
    setActiveDungeon((prev) => {
      if (!prev) return null;
      const ex = prev.exercises[exerciseIndex];
      const targetSet = ex?.sets.find((s) => s.id === setId);
      if (!targetSet) return prev;

      const nextExercises = prev.exercises.map((item, idx) =>
        idx === exerciseIndex
          ? {
              ...item,
              sets: item.sets
                .filter((s) => s.id !== setId)
                .map((s, i) => ({ ...s, setNumber: i + 1 }))
            }
          : item
      );
      return {
        ...prev,
        bossCurrentHp: Math.min(prev.bossMaxHp, prev.bossCurrentHp + targetSet.damageDealt),
        totalVolumeKg: Math.max(0, prev.totalVolumeKg - targetSet.weightKg * targetSet.reps),
        prsHit: Math.max(0, prev.prsHit - (targetSet.isPersonalRecord ? 1 : 0)),
        exercises: nextExercises
      };
    });
  };

  const startRestTimer = (seconds: number) => {
    soundEngine.playTick();
    setActiveDungeon((prev) =>
      prev ? { ...prev, restTimerSeconds: seconds, restTimerRunning: true } : null
    );
  };

  const skipRestTimer = () => {
    soundEngine.playTick(1.3);
    setActiveDungeon((prev) =>
      prev ? { ...prev, restTimerSeconds: 0, restTimerRunning: false } : null
    );
  };

  const completeDungeonRaid = () => {
    if (!activeDungeon) return;
    const totalSets = activeDungeon.exercises.reduce((acc, e) => acc + e.sets.length, 0);
    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - activeDungeon.startedAt) / 60000)
    );

    const bossDefeated = activeDungeon.bossCurrentHp === 0;
    const completionMultiplier = bossDefeated ? 1.25 : Math.max(0.5, totalSets / 10);
    const xpEarned = Math.round(activeDungeon.dungeon.xpReward * completionMultiplier);
    const goldEarned = Math.round(activeDungeon.dungeon.goldReward * completionMultiplier);

    const musclesTrained = Array.from(
      new Set(
        activeDungeon.exercises
          .filter((e) => e.sets.length > 0)
          .map((e) => e.template.muscleGroup)
      )
    );

    const record: CompletedWorkoutRecord = {
      id: `history-${Date.now()}`,
      dungeonName: activeDungeon.dungeon.name,
      bossName: activeDungeon.dungeon.bossName,
      rank: activeDungeon.dungeon.rank,
      completedAt: Date.now(),
      durationMinutes,
      totalVolumeKg: activeDungeon.totalVolumeKg,
      setsCompleted: totalSets,
      prsHit: activeDungeon.prsHit,
      xpEarned,
      goldEarned,
      musclesTrained
    };

    setWorkoutHistory((prev) => [record, ...prev]);

    const statGains: Partial<CoreStats> = { STR: 1, VIT: 1 };
    if (activeDungeon.prsHit > 0) {
      statGains.STR = (statGains.STR ?? 1) + activeDungeon.prsHit;
      statGains.PER = 1;
    }

    const isIgrisJobQuest = activeDungeon.dungeon.id === 'dungeon-igris-job';

    grantXpAndGold(xpEarned, goldEarned, statGains);

    setProfile((prev) => ({
      ...prev,
      fatigue: Math.min(100, prev.fatigue + Math.min(25, totalSets * 2)),
      job: isIgrisJobQuest ? 'Shadow Monarch' : prev.job,
      shadowMonarchUnlocked: isIgrisJobQuest ? true : prev.shadowMonarchUnlocked,
      rank: isIgrisJobQuest
        ? 'Shadow Monarch'
        : calculateRankForLevel(prev.level, prev.shadowMonarchUnlocked)
    }));

    if (isIgrisJobQuest) {
      setUserThemePreference('purple');
      setTitles((prev) =>
        prev.map((t) => (t.id === 'title-monarch' ? { ...t, unlocked: true } : t))
      );
    }

    setTitles((prev) =>
      prev.map((t) => (t.id === 'title-wolf' ? { ...t, unlocked: true } : t))
    );

    const dropId = activeDungeon.dungeon.shadowDropId;
    const dropShadow = shadows.find((s) => s.id === dropId);
    const lockedShadow =
      dropShadow && !dropShadow.unlocked
        ? dropShadow
        : shadows.find((s) => !s.unlocked);

    if (lockedShadow && (bossDefeated || activeDungeon.prsHit > 0 || totalSets >= 3)) {
      soundEngine.playArise();
      setAriseCandidate({
        shadow: lockedShadow,
        attemptsLeft: 3,
        reason: `Boss "${activeDungeon.dungeon.bossName}" defeated. Extract its shadow!`
      });
    } else {
      soundEngine.playLevelUp();
    }

    pushNotification(
      `[GATE CLEARED]`,
      `+${xpEarned} XP • ${activeDungeon.totalVolumeKg.toLocaleString()} kg volume lifted.`,
      'levelup'
    );

    setActiveDungeon(null);
  };

  const abandonDungeonRaid = () => {
    soundEngine.playTick(0.7);
    setActiveDungeon(null);
  };

  const attemptShadowExtraction = (): { success: boolean; message: string } => {
    if (!ariseCandidate) return { success: false, message: 'No target shadow.' };
    soundEngine.playArise();

    const successChance =
      ariseCandidate.attemptsLeft === 1
        ? 1.0
        : Math.min(0.92, 0.6 + effectiveStats.INT * 0.015);
    const succeeded = Math.random() <= successChance;

    if (succeeded) {
      const targetId = ariseCandidate.shadow.id;
      setShadows((prev) =>
        prev.map((s) => (s.id === targetId ? { ...s, unlocked: true } : s))
      );
      pushNotification(
        `[ARISE: ${ariseCandidate.shadow.name.toUpperCase()}]`,
        `${ariseCandidate.shadow.name} joined your Shadow Army (${ariseCandidate.shadow.passiveBuffText}).`,
        'arise'
      );
      setAriseCandidate(null);
      return {
        success: true,
        message: `[SYSTEM] ${ariseCandidate.shadow.name} extracted!`
      };
    } else {
      const nextAttempts = ariseCandidate.attemptsLeft - 1;
      setAriseCandidate((prev) =>
        prev ? { ...prev, attemptsLeft: nextAttempts } : null
      );
      return {
        success: false,
        message: `Extraction failed (${nextAttempts} attempts left). Command "ARISE" again!`
      };
    }
  };

  const dismissAriseModal = () => {
    setAriseCandidate(null);
  };

  const upgradeShadow = (shadowId: string) => {
    const target = shadows.find((s) => s.id === shadowId);
    if (!target || !target.unlocked) return;
    const cost = target.level * 450;
    if (profile.gold < cost) return;

    soundEngine.playLevelUp();
    setProfile((prev) => ({ ...prev, gold: prev.gold - cost }));
    setShadows((prev) =>
      prev.map((s) =>
        s.id === shadowId
          ? {
              ...s,
              level: s.level + 1,
              xpMultiplierBonus: Number((s.xpMultiplierBonus + 0.02).toFixed(2))
            }
          : s
      )
    );
  };

  const buyShopItem = (itemId: string) => {
    const item = SYSTEM_SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || profile.gold < item.costGold) return;
    soundEngine.playLevelUp();

    if (itemId === 'item-elixir') {
      setProfile((prev) => ({
        ...prev,
        gold: prev.gold - item.costGold,
        inventory: {
          ...prev.inventory,
          'item-elixir': (prev.inventory['item-elixir'] ?? 0) + 1
        }
      }));
      return;
    }

    if (itemId === 'item-cursed-box') {
      setProfile((prev) => ({
        ...prev,
        gold: prev.gold - item.costGold,
        unallocatedPoints: prev.unallocatedPoints + 3
      }));
      grantXpAndGold(300, 0);
      return;
    }

    if (itemId === 'item-monarch-awakening') {
      setProfile((prev) => ({
        ...prev,
        gold: prev.gold - item.costGold,
        job: 'Shadow Monarch',
        rank: 'Shadow Monarch',
        shadowMonarchUnlocked: true
      }));
      setUserThemePreference('purple');
    }
  };

  const exportSaveData = (): string => {
    return JSON.stringify(
      {
        profile,
        dailyQuests,
        customDungeons,
        workoutHistory,
        shadows,
        titles,
        muscleFatigue,
        userThemePreference
      },
      null,
      2
    );
  };

  const importSaveData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile) return false;
      setProfile({ ...DEFAULT_HUNTER_PROFILE, ...parsed.profile });
      if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests);
      if (parsed.workoutHistory) setWorkoutHistory(parsed.workoutHistory);
      if (parsed.shadows) setShadows(parsed.shadows);
      soundEngine.playLevelUp();
      return true;
    } catch {
      return false;
    }
  };

  const resetHunterSystem = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_HUNTER_PROFILE);
    setDailyQuests(INITIAL_DAILY_QUESTS);
    setActiveDungeon(null);
    setWorkoutHistory([]);
    setShadows(INITIAL_SHADOW_ARMY);
    setTitles(HUNTER_TITLES);
    setUserThemePreference('blue');
  };

  const allDungeons = useMemo(
    () => [...customDungeons, ...DUNGEON_TEMPLATES],
    [customDungeons]
  );

  return (
    <SystemContext.Provider
      value={{
        profile,
        effectiveStats,
        dailyQuests,
        dungeons: allDungeons,
        activeDungeon,
        workoutHistory,
        shadows,
        titles,
        muscleFatigue,
        notifications,
        ariseCandidate,
        theme,
        userThemePreference,
        foldPostureSetting,
        resolvedPosture,
        soundEnabled,
        completeAwakening,
        setFoldPostureSetting,
        setUserThemePreference,
        toggleSound,
        allocateStatPoint,
        equipTitle,
        incrementDailyQuest,
        updateDailyQuestTarget,
        claimDailyRewards,
        claimSecretDailyReward,
        triggerPenaltySimulation,
        completePenaltyReps,
        useElixirOfLife,
        addHydration,
        addProtein,
        startDungeonRaid,
        startArchitectInstantDungeon,
        createCustomDungeon,
        selectActiveExercise,
        logExerciseSet,
        deleteExerciseSet,
        startRestTimer,
        skipRestTimer,
        completeDungeonRaid,
        abandonDungeonRaid,
        attemptShadowExtraction,
        dismissAriseModal,
        upgradeShadow,
        buyShopItem,
        dismissNotification,
        exportSaveData,
        importSaveData,
        resetHunterSystem
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = (): SystemContextValue => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used inside SystemProvider');
  return ctx;
};
