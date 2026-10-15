import {
  DailyQuestItem,
  DungeonTemplate,
  HunterProfile,
  HunterRank,
  HunterTitle,
  MuscleGroup,
  ShadowSoldier,
  ShopItem,
  StrengthStandard80Kg
} from '../types/system';

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quads',
  'Hamstrings',
  'Core',
  'Cardio'
];

// Real-World Strength Standards for 187 cm / 80 kg Male (Estimated 1RM in kg)
export const STRENGTH_STANDARDS_80KG: StrengthStandard80Kg[] = [
  {
    exerciseId: 'ex-incline-press',
    label: 'Incline / Bench Press',
    unit: 'kg',
    eRank: 60,
    cRank: 80, // 1.0x BW
    aRank: 100, // 1.25x BW
    sRank: 120 // 1.5x BW
  },
  {
    exerciseId: 'ex-weighted-pullup',
    label: 'Weighted Pull-Up (Total Load)',
    unit: 'kg',
    eRank: 80, // Bodyweight (80kg)
    cRank: 95, // +15kg
    aRank: 110, // +30kg
    sRank: 125 // +45kg
  },
  {
    exerciseId: 'ex-squat',
    label: 'Squat / Hack Squat',
    unit: 'kg',
    eRank: 75,
    cRank: 105, // 1.3x BW
    aRank: 135, // 1.7x BW
    sRank: 160 // 2.0x BW
  },
  {
    exerciseId: 'ex-rdl',
    label: 'Romanian / Deadlift',
    unit: 'kg',
    eRank: 95,
    cRank: 130, // 1.6x BW
    aRank: 165, // 2.0x BW
    sRank: 195 // 2.4x BW
  },
  {
    exerciseId: 'ex-ohp',
    label: 'Overhead Shoulder Press',
    unit: 'kg',
    eRank: 40,
    cRank: 52, // 0.65x BW
    aRank: 65, // 0.8x BW
    sRank: 80 // 1.0x BW
  }
];

export const INITIAL_DAILY_QUESTS: DailyQuestItem[] = [
  {
    id: 'dq-pushups',
    name: 'Push-Ups',
    current: 0,
    target: 100,
    secretTarget: 200,
    unit: 'reps',
    statReward: 'STR',
    stepSize: 25,
    muscleGroup: 'Chest'
  },
  {
    id: 'dq-situps',
    name: 'Core / Leg Raises',
    current: 0,
    target: 100,
    secretTarget: 200,
    unit: 'reps',
    statReward: 'VIT',
    stepSize: 25,
    muscleGroup: 'Core'
  },
  {
    id: 'dq-squats',
    name: 'Air Squats',
    current: 0,
    target: 100,
    secretTarget: 200,
    unit: 'reps',
    statReward: 'VIT',
    stepSize: 25,
    muscleGroup: 'Quads'
  },
  {
    id: 'dq-run',
    name: 'Run / Conditioning',
    current: 0,
    target: 5,
    secretTarget: 10,
    unit: 'km',
    statReward: 'AGI',
    stepSize: 1,
    muscleGroup: 'Cardio'
  }
];

export const HUNTER_TITLES: HunterTitle[] = [
  {
    id: 'title-weakest',
    name: 'The Weakest Hunter of All Mankind',
    description: 'Selected by the Architect as the sole Player of the System.',
    unlocked: true,
    bonusText: '+2 VIT (Tenacity)',
    statBoost: { VIT: 2 }
  },
  {
    id: 'title-wolf',
    name: 'Wolf Slayer',
    description: 'Earned after clearing your first Dungeon Protocol.',
    unlocked: false,
    bonusText: '+3 AGI, +3 PER',
    statBoost: { AGI: 3, PER: 3 }
  },
  {
    id: 'title-adversity',
    name: 'One Who Overcame Adversity',
    description: 'Earned by surviving the Penalty Zone or hitting 200% on the Daily Quest.',
    unlocked: false,
    bonusText: '+5 STR, +5 VIT',
    statBoost: { STR: 5, VIT: 5 }
  },
  {
    id: 'title-demon',
    name: 'Demon Castle Conqueror',
    description: 'Reached C-Rank or higher on the 187cm / 80kg V-Taper Protocol.',
    unlocked: false,
    bonusText: '+6 INT, +6 STR',
    statBoost: { INT: 6, STR: 6 }
  },
  {
    id: 'title-monarch',
    name: 'Monarch of Shadows',
    description: 'Defeated Blood-Red Commander Igris and inherited the Sovereign Authority.',
    unlocked: false,
    bonusText: '+12 ALL STATS & Sovereign Aura',
    statBoost: { STR: 12, AGI: 12, VIT: 12, INT: 12, PER: 12 }
  }
];

export const INITIAL_SHADOW_ARMY: ShadowSoldier[] = [
  {
    id: 'shadow-igris',
    name: 'Igris',
    title: 'Blood-Red Commander',
    rank: 'Commander',
    unlocked: false,
    level: 1,
    passiveBuffText: '+12% XP & +5 STR',
    statBonusKey: 'STR',
    statBonusValue: 5,
    xpMultiplierBonus: 0.12,
    lore: 'Crimson knight of the empty throne. Governs heavy compound pressing and blade precision.',
    unlockRequirement: 'Clear the Igris Boss Trial or hit a new Lift PR',
    avatarGlyph: '⚔️'
  },
  {
    id: 'shadow-iron',
    name: 'Iron',
    title: 'Heavy Shield Vanguard',
    rank: 'Elite Knight',
    unlocked: false,
    level: 1,
    passiveBuffText: '+8% XP & +5 VIT',
    statBonusKey: 'VIT',
    statBonusValue: 5,
    xpMultiplierBonus: 0.08,
    lore: 'Colossal vanguard shadow. Forged through upper chest and shoulder pressing volume.',
    unlockRequirement: 'Complete Monday Gate I (V-Taper Push)',
    avatarGlyph: '🛡️'
  },
  {
    id: 'shadow-tusk',
    name: 'Tusk',
    title: 'High Orc Grand Spellcaster',
    rank: 'Commander',
    unlocked: false,
    level: 1,
    passiveBuffText: '+12% XP & +6 INT',
    statBonusKey: 'INT',
    statBonusValue: 6,
    xpMultiplierBonus: 0.12,
    lore: 'Amplifies gravity and upper-lat mind-muscle connection.',
    unlockRequirement: 'Complete Tuesday Gate II (V-Taper Pull)',
    avatarGlyph: '🔥'
  },
  {
    id: 'shadow-kaisel',
    name: 'Kaisel',
    title: 'Sky Sovereign Wyvern',
    rank: 'Elite Knight',
    unlocked: false,
    level: 1,
    passiveBuffText: '+10% XP & +6 AGI',
    statBonusKey: 'AGI',
    statBonusValue: 6,
    xpMultiplierBonus: 0.1,
    lore: 'Winged shadow steed from the Demon Castle skies with boundless stamina.',
    unlockRequirement: 'Complete the Daily Quest or Wednesday Conditioning',
    avatarGlyph: '🐉'
  },
  {
    id: 'shadow-tank',
    name: 'Tank',
    title: 'Alpha Ice Bear Shadow',
    rank: 'Knight',
    unlocked: false,
    level: 1,
    passiveBuffText: '+10% XP & +4 VIT',
    statBonusKey: 'VIT',
    statBonusValue: 4,
    xpMultiplierBonus: 0.1,
    lore: 'Unstoppable lower-body drive forged in the Red Gate snowfield.',
    unlockRequirement: 'Complete Thursday Gate IV (Lower Body Power)',
    avatarGlyph: '🐻'
  },
  {
    id: 'shadow-beru',
    name: 'Beru',
    title: 'Ant King Marshal',
    rank: 'Marshal',
    unlocked: false,
    level: 1,
    passiveBuffText: '+20% XP & +10 PER',
    statBonusKey: 'PER',
    statBonusValue: 10,
    xpMultiplierBonus: 0.2,
    lore: 'Apex predator of Jeju Island. Unlocks peak speed and V-taper dominance.',
    unlockRequirement: 'Complete Friday Gate V or claim a Blessed Random Box',
    avatarGlyph: '👑'
  }
];

// Researched 187 cm / 80 kg Weekly V-Taper & Relative Strength Protocol
export const DUNGEON_TEMPLATES: DungeonTemplate[] = [
  {
    id: 'dungeon-mon-push',
    dayCode: 'MON',
    dayLabel: 'MONDAY // GATE I',
    name: 'V-Taper Push (Upper Chest Shelf & Side Delts)',
    rank: 'C-Rank',
    gateType: 'Normal Gate',
    bossName: 'Vulcan, Demon Castle Gatekeeper',
    bossTitle: 'Upper Clavicular & Deltoid Protocol (187cm Calibration)',
    description:
      'Engineered for a 187cm frame: prioritizes incline pressing to fill the upper chest shelf and high-volume lateral raises to widen the clavicle-to-waist V-taper.',
    recommendedLevel: 1,
    xpReward: 450,
    goldReward: 900,
    shadowDropId: 'shadow-iron',
    exercises: [
      {
        id: 'ex-incline-press',
        name: 'Incline Dumbbell or Barbell Press',
        cue: '30° bench angle • Deep stretch at bottom for 187cm arm levers',
        muscleGroup: 'Chest',
        secondaryMuscles: ['Shoulders', 'Triceps'],
        targetSets: 4,
        targetReps: '8-10',
        suggestedWeightKg: 65,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-ohp',
        name: 'Seated Overhead Shoulder Press',
        cue: 'Strict vertical press • Full lockout for capped deltoids',
        muscleGroup: 'Shoulders',
        secondaryMuscles: ['Triceps', 'Core'],
        targetSets: 3,
        targetReps: '8-10',
        suggestedWeightKg: 45,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-lateral-raise',
        name: 'Cable or Dumbbell Lateral Raises',
        cue: 'Lead with elbows slightly forward • #1 V-Taper width movement',
        muscleGroup: 'Shoulders',
        targetSets: 4,
        targetReps: '12-15',
        suggestedWeightKg: 12.5,
        isCompound: false,
        statFocus: 'PER'
      },
      {
        id: 'ex-tricep-dip',
        name: 'Weighted Dips or Rope Pushdowns',
        cue: 'Controlled 2-second eccentric • Full elbow extension',
        muscleGroup: 'Triceps',
        targetSets: 3,
        targetReps: '10-12',
        suggestedWeightKg: 30,
        isCompound: false,
        statFocus: 'STR'
      }
    ]
  },
  {
    id: 'dungeon-tue-pull',
    dayCode: 'TUE',
    dayLabel: 'TUESDAY // GATE II',
    name: 'V-Taper Pull (Lat Flare & Upper Back Density)',
    rank: 'C-Rank',
    gateType: 'Normal Gate',
    bossName: 'Blue Venom-Fanged Kasaka',
    bossTitle: 'Posterior Width & Arm Fullness Protocol',
    description:
      'Builds dramatic upper-lat flare and mid-back thickness while protecting the lower back on a 187cm frame.',
    recommendedLevel: 1,
    xpReward: 450,
    goldReward: 900,
    shadowDropId: 'shadow-tusk',
    exercises: [
      {
        id: 'ex-weighted-pullup',
        name: 'Weighted Pull-Ups / Wide Lat Pulldown',
        cue: 'Drive elbows down to hips • Chest to bar for maximum lat flare',
        muscleGroup: 'Back',
        secondaryMuscles: ['Biceps', 'Core'],
        targetSets: 4,
        targetReps: '8-10',
        suggestedWeightKg: 80,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-chest-supported-row',
        name: 'Chest-Supported Row / Barbell Row',
        cue: 'Squeeze scapulae 1s at peak • Eliminates lower-back fatigue',
        muscleGroup: 'Back',
        targetSets: 3,
        targetReps: '8-10',
        suggestedWeightKg: 65,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-face-pull',
        name: 'Rear Delt Cable Face Pulls',
        cue: 'Pull to forehead with external rotation • Builds 3D shoulder posture',
        muscleGroup: 'Shoulders',
        secondaryMuscles: ['Back'],
        targetSets: 3,
        targetReps: '15',
        suggestedWeightKg: 25,
        isCompound: false,
        statFocus: 'PER'
      },
      {
        id: 'ex-incline-curl',
        name: 'Incline Dumbbell Curls',
        cue: 'Arms behind torso for long-head stretch on tall frames',
        muscleGroup: 'Biceps',
        targetSets: 3,
        targetReps: '10-12',
        suggestedWeightKg: 16,
        isCompound: false,
        statFocus: 'STR'
      }
    ]
  },
  {
    id: 'dungeon-wed-cond',
    dayCode: 'WED',
    dayLabel: 'WEDNESDAY // GATE III',
    name: 'Hunter Conditioning & Core Control',
    rank: 'D-Rank',
    gateType: 'Instant Dungeon',
    bossName: 'Steel-Fanged Lycan Pack',
    bossTitle: 'Relative Bodyweight Mastery (80kg)',
    description:
      'Mid-week active recovery, explosive calisthenics, and core compression to sharpen waist-to-shoulder ratio.',
    recommendedLevel: 1,
    xpReward: 380,
    goldReward: 750,
    shadowDropId: 'shadow-kaisel',
    exercises: [
      {
        id: 'ex-weighted-pullup',
        name: 'Strict Bodyweight Pull-Ups',
        cue: 'Dead hang to chin over bar • Explosive concentric',
        muscleGroup: 'Back',
        targetSets: 4,
        targetReps: '10',
        suggestedWeightKg: 80,
        isCompound: true,
        statFocus: 'AGI'
      },
      {
        id: 'ex-dips-bw',
        name: 'Decline / Diamond Push-Ups',
        cue: 'Core locked • Chest grazes floor every rep',
        muscleGroup: 'Chest',
        targetSets: 4,
        targetReps: '20',
        suggestedWeightKg: 80,
        isCompound: true,
        statFocus: 'VIT'
      },
      {
        id: 'ex-hanging-leg-raise',
        name: 'Hanging Leg Raises (Toes to Bar)',
        cue: 'Curl pelvis up • Zero momentum swing',
        muscleGroup: 'Core',
        targetSets: 4,
        targetReps: '15',
        suggestedWeightKg: 80,
        isCompound: false,
        statFocus: 'VIT'
      },
      {
        id: 'ex-sprint-intervals',
        name: 'HIIT Sprints / Jump Rope Conditioning',
        cue: '15 min high-output agility conditioning',
        muscleGroup: 'Cardio',
        targetSets: 3,
        targetReps: '5',
        suggestedWeightKg: 80,
        isCompound: true,
        statFocus: 'AGI'
      }
    ]
  },
  {
    id: 'dungeon-thu-legs',
    dayCode: 'THU',
    dayLabel: 'THURSDAY // GATE IV',
    name: 'Lower Body Power & Core Armor',
    rank: 'B-Rank',
    gateType: 'Red Gate',
    bossName: 'Baruka, Ice Elf Sovereign',
    bossTitle: 'Athletic Leg Drive & Posterior Chain (187cm Lever Optimized)',
    description:
      'Uses Hack Squats/Back Squats, RDLs, and Split Squats to build dense, athletic legs without excessive spinal shear on long femurs.',
    recommendedLevel: 2,
    xpReward: 550,
    goldReward: 1150,
    shadowDropId: 'shadow-tank',
    exercises: [
      {
        id: 'ex-squat',
        name: 'Hack Squat or Barbell Back Squat',
        cue: 'Deep knee flexion • Controlled descent',
        muscleGroup: 'Quads',
        secondaryMuscles: ['Hamstrings', 'Core'],
        targetSets: 4,
        targetReps: '6-8',
        suggestedWeightKg: 95,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-rdl',
        name: 'Romanian Deadlift (RDL)',
        cue: 'Push hips back • Deep hamstring stretch to mid-shin',
        muscleGroup: 'Hamstrings',
        secondaryMuscles: ['Back'],
        targetSets: 3,
        targetReps: '8-10',
        suggestedWeightKg: 105,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-split-squat',
        name: 'Bulgarian Split Squats / Leg Press',
        cue: 'Unilateral stability & quad sweep',
        muscleGroup: 'Quads',
        targetSets: 3,
        targetReps: '10',
        suggestedWeightKg: 48,
        isCompound: true,
        statFocus: 'AGI'
      },
      {
        id: 'ex-hanging-leg-raise',
        name: 'Weighted Hanging Leg Raises / Ab Wheel',
        cue: 'Lower abdominal armor',
        muscleGroup: 'Core',
        targetSets: 4,
        targetReps: '12-15',
        suggestedWeightKg: 80,
        isCompound: false,
        statFocus: 'VIT'
      }
    ]
  },
  {
    id: 'dungeon-fri-monarch',
    dayCode: 'FRI',
    dayLabel: 'FRIDAY // GATE V',
    name: 'Monarch Hybrid (V-Taper Specialization + Arms)',
    rank: 'A-Rank',
    gateType: 'Normal Gate',
    bossName: 'Ant King Beru',
    bossTitle: 'High-Frequency Upper Aesthetics',
    description:
      'Second weekly hit for Lats, Upper Chest, Side Delts, and Arms to accelerate V-taper hypertrophy on a 187cm / 80kg frame.',
    recommendedLevel: 3,
    xpReward: 520,
    goldReward: 1100,
    shadowDropId: 'shadow-beru',
    exercises: [
      {
        id: 'ex-weighted-pullup',
        name: 'Weighted Chin-Ups / Close-Grip Pulldown',
        cue: 'Supinated/neutral grip • Maximum lat + bicep recruitment',
        muscleGroup: 'Back',
        secondaryMuscles: ['Biceps'],
        targetSets: 3,
        targetReps: '8-10',
        suggestedWeightKg: 85,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-incline-press',
        name: 'Incline Barbell / Machine Press',
        cue: 'Explosive concentric • Upper chest density',
        muscleGroup: 'Chest',
        targetSets: 3,
        targetReps: '8-10',
        suggestedWeightKg: 70,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-lateral-raise',
        name: 'Cable Lateral Raise (Strict Pause)',
        cue: 'Constant tension across the bottom 30°',
        muscleGroup: 'Shoulders',
        targetSets: 4,
        targetReps: '15',
        suggestedWeightKg: 12.5,
        isCompound: false,
        statFocus: 'PER'
      },
      {
        id: 'ex-arm-superset',
        name: 'EZ-Bar Curl + Overhead Tricep Extension',
        cue: 'Full arm stretch & peak contraction',
        muscleGroup: 'Biceps',
        secondaryMuscles: ['Triceps'],
        targetSets: 3,
        targetReps: '12',
        suggestedWeightKg: 35,
        isCompound: false,
        statFocus: 'STR'
      }
    ]
  },
  {
    id: 'dungeon-igris-job',
    dayCode: 'BOSS',
    dayLabel: 'BOSS TRIAL // S-RANK',
    name: 'Job Change Trial: Blood-Red Commander Igris',
    rank: 'S-Rank',
    gateType: 'Job Change Boss',
    bossName: 'Blood-Red Commander Igris',
    bossTitle: '80kg Strength Rank Evaluation',
    description:
      'Test your 4 core compound lifts against the 80kg Hunter Rank Benchmarks. Clearing this trial awakens the Shadow Monarch class.',
    recommendedLevel: 5,
    xpReward: 1200,
    goldReward: 3000,
    shadowDropId: 'shadow-igris',
    exercises: [
      {
        id: 'ex-incline-press',
        name: 'Heavy Incline / Flat Press (PR Test)',
        cue: 'C-Rank: 80kg • A-Rank: 100kg • S-Rank: 120kg',
        muscleGroup: 'Chest',
        targetSets: 3,
        targetReps: '5',
        suggestedWeightKg: 80,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-weighted-pullup',
        name: 'Weighted Pull-Up (Total BW + Load)',
        cue: 'C-Rank: 95kg • A-Rank: 110kg • S-Rank: 125kg',
        muscleGroup: 'Back',
        targetSets: 3,
        targetReps: '5',
        suggestedWeightKg: 90,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-squat',
        name: 'Heavy Squat / Hack Squat',
        cue: 'C-Rank: 105kg • A-Rank: 135kg • S-Rank: 160kg',
        muscleGroup: 'Quads',
        targetSets: 3,
        targetReps: '5',
        suggestedWeightKg: 105,
        isCompound: true,
        statFocus: 'STR'
      },
      {
        id: 'ex-ohp',
        name: 'Strict Overhead Shoulder Press',
        cue: 'C-Rank: 52kg • A-Rank: 65kg • S-Rank: 80kg',
        muscleGroup: 'Shoulders',
        targetSets: 3,
        targetReps: '5',
        suggestedWeightKg: 52.5,
        isCompound: true,
        statFocus: 'PER'
      }
    ]
  }
];

export const SYSTEM_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'item-elixir',
    name: 'Purified Elixir of Life (Rest Day Shield)',
    category: 'Consumable',
    costGold: 600,
    description: 'Protects your streak for 24h and resets Fatigue to 0%.',
    effectText: 'Rest Day Shield + Full Fatigue Reset',
    iconName: 'FlaskConical'
  },
  {
    id: 'item-cursed-box',
    name: 'Blessed Random Box',
    category: 'Artifact',
    costGold: 800,
    description: 'Grants +3 Stat Points and +300 Bonus XP.',
    effectText: '+3 Stat Points & +300 XP',
    iconName: 'PackageOpen'
  },
  {
    id: 'item-monarch-awakening',
    name: 'Black Heart of the Shadow Sovereign',
    category: 'Cosmetic',
    costGold: 2000,
    description: 'Awakens Ashborn’s Black Heart and unlocks the Sovereign Purple System HUD.',
    effectText: 'Unlock Shadow Monarch Class + Purple HUD',
    iconName: 'Crown'
  }
];

export function calculateRankForLevel(level: number, shadowMonarchUnlocked: boolean): HunterRank {
  if (shadowMonarchUnlocked || level >= 40) return 'Shadow Monarch';
  if (level >= 25) return 'S-Rank';
  if (level >= 18) return 'A-Rank';
  if (level >= 12) return 'B-Rank';
  if (level >= 7) return 'C-Rank';
  if (level >= 3) return 'D-Rank';
  return 'E-Rank';
}

export function getTodayRecommendedDayCode(): 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'BOSS' {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  switch (day) {
    case 1:
      return 'MON';
    case 2:
      return 'TUE';
    case 3:
      return 'WED';
    case 4:
      return 'THU';
    case 5:
      return 'FRI';
    default:
      return 'BOSS';
  }
}

export const DEFAULT_HUNTER_PROFILE: HunterProfile = {
  awakened: true, // Pre-calibrated exclusively for User (187 cm / 80 kg) — zero onboarding clutter!
  name: 'PLAYER // 187CM • 80KG',
  job: 'Shadow Monarch Candidate',
  rank: 'E-Rank',
  equippedTitleId: 'title-weakest',
  level: 1,
  xp: 0,
  xpToNextLevel: 300,
  unallocatedPoints: 3,
  stats: {
    STR: 15,
    AGI: 16,
    VIT: 15,
    INT: 14,
    PER: 15
  },
  hp: 1500,
  maxHp: 1500,
  mp: 320,
  maxMp: 320,
  fatigue: 0,
  gold: 1000,
  streakDays: 1,
  restDayShieldActive: false,
  penaltyZoneActive: false,
  penaltyRepsRemaining: 0,
  shadowMonarchUnlocked: false,
  bodyweightKg: 80,
  heightCm: 187,
  preferredSplit: '4-Day V-Taper + Conditioning (187cm / 80kg)',
  hydrationMl: 0,
  hydrationTargetMl: 3200,
  proteinGrams: 0,
  proteinTargetGrams: 175,
  lastDailyResetDate: new Date().toISOString().slice(0, 10),
  dailyQuestCompletedToday: false,
  dailyRewardsClaimedToday: false,
  secretQuestClaimedToday: false,
  inventory: {
    'item-elixir': 1
  },
  personalRecords: {
    'ex-incline-press': 75,
    'ex-weighted-pullup': 88,
    'ex-squat': 95,
    'ex-rdl': 115,
    'ex-ohp': 48
  }
};
