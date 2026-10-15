export type SystemTheme = 'blue' | 'red' | 'purple';

export type FoldPosture = 'auto' | 'cover' | 'unfolded' | 'flex';

export type HunterRank = 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank' | 'Shadow Monarch';

export type StatKey = 'STR' | 'AGI' | 'VIT' | 'INT' | 'PER';

export type CoreStats = Record<StatKey, number>;

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Quads'
  | 'Hamstrings'
  | 'Core'
  | 'Cardio';

export interface DailyQuestItem {
  id: string;
  name: string;
  current: number;
  target: number;
  secretTarget: number;
  unit: string;
  statReward: StatKey;
  stepSize: number;
  muscleGroup: MuscleGroup;
}

export interface DungeonExerciseTemplate {
  id: string;
  name: string;
  cue?: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  targetSets: number;
  targetReps: string;
  suggestedWeightKg: number;
  isCompound: boolean;
  statFocus: StatKey;
}

export interface DungeonTemplate {
  id: string;
  dayCode: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'BOSS';
  dayLabel: string;
  name: string;
  rank: HunterRank;
  gateType: 'Normal Gate' | 'Red Gate' | 'Job Change Boss' | 'Instant Dungeon';
  bossName: string;
  bossTitle: string;
  description: string;
  recommendedLevel: number;
  xpReward: number;
  goldReward: number;
  shadowDropId?: string;
  exercises: DungeonExerciseTemplate[];
}

export interface StrengthStandard80Kg {
  exerciseId: string;
  label: string;
  unit: string;
  eRank: number;
  cRank: number;
  aRank: number;
  sRank: number;
}

export interface LoggedSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe: number;
  setType: 'Warmup' | 'Working' | 'PR Attempt' | 'Drop Set';
  completed: boolean;
  isPersonalRecord?: boolean;
  estimated1RM: number;
  damageDealt: number;
  timestamp: number;
}

export interface ActiveDungeonExercise {
  template: DungeonExerciseTemplate;
  sets: LoggedSet[];
}

export interface ActiveDungeonSession {
  id: string;
  dungeon: DungeonTemplate;
  startedAt: number;
  bossMaxHp: number;
  bossCurrentHp: number;
  activeExerciseIndex: number;
  exercises: ActiveDungeonExercise[];
  restTimerSeconds: number;
  restTimerRunning: boolean;
  totalVolumeKg: number;
  prsHit: number;
}

export interface CompletedWorkoutRecord {
  id: string;
  dungeonName: string;
  bossName: string;
  rank: HunterRank;
  completedAt: number;
  durationMinutes: number;
  totalVolumeKg: number;
  setsCompleted: number;
  prsHit: number;
  xpEarned: number;
  goldEarned: number;
  musclesTrained: MuscleGroup[];
}

export interface ShadowSoldier {
  id: string;
  name: string;
  title: string;
  rank: 'Normal' | 'Elite' | 'Knight' | 'Elite Knight' | 'Commander' | 'Marshal';
  unlocked: boolean;
  level: number;
  passiveBuffText: string;
  statBonusKey: StatKey;
  statBonusValue: number;
  xpMultiplierBonus: number;
  lore: string;
  unlockRequirement: string;
  avatarGlyph: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'Consumable' | 'Key' | 'Cosmetic' | 'Artifact';
  costGold: number;
  description: string;
  effectText: string;
  iconName: string;
}

export interface HunterTitle {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  bonusText: string;
  statBoost: Partial<CoreStats>;
}

export interface MuscleFatigueState {
  muscle: MuscleGroup;
  recoveryPercent: number;
  lastTrainedAt: number | null;
  recentSetsCount: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'levelup' | 'warning' | 'arise' | 'pr';
  timestamp: number;
}

export interface HunterProfile {
  awakened: boolean;
  name: string;
  job: string;
  rank: HunterRank;
  equippedTitleId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  unallocatedPoints: number;
  stats: CoreStats;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  fatigue: number;
  gold: number;
  streakDays: number;
  restDayShieldActive: boolean;
  penaltyZoneActive: boolean;
  penaltyRepsRemaining: number;
  shadowMonarchUnlocked: boolean;
  bodyweightKg: number;
  heightCm: number;
  preferredSplit: string;
  hydrationMl: number;
  hydrationTargetMl: number;
  proteinGrams: number;
  proteinTargetGrams: number;
  lastDailyResetDate: string;
  dailyQuestCompletedToday: boolean;
  dailyRewardsClaimedToday: boolean;
  secretQuestClaimedToday: boolean;
  inventory: Record<string, number>;
  personalRecords: Record<string, number>;
}
