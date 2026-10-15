import { ALL_MUSCLE_GROUPS, DUNGEON_TEMPLATES } from '../data/systemDatabase';
import {
  DungeonExerciseTemplate,
  DungeonTemplate,
  HunterProfile,
  MuscleFatigueState,
  MuscleGroup
} from '../types/system';

export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return Math.round(weightKg);
  // Epley formula
  return Math.round(weightKg * (1 + reps / 30));
}

export function initializeMuscleFatigue(): Record<MuscleGroup, MuscleFatigueState> {
  const map = {} as Record<MuscleGroup, MuscleFatigueState>;
  for (const muscle of ALL_MUSCLE_GROUPS) {
    map[muscle] = {
      muscle,
      recoveryPercent: 100,
      lastTrainedAt: null,
      recentSetsCount: 0
    };
  }
  return map;
}

// Recomputes passive time-based recovery (roughly +2% per hour elapsed since last trained)
export function computeCurrentMuscleRecovery(
  fatigueMap: Record<MuscleGroup, MuscleFatigueState>
): Record<MuscleGroup, MuscleFatigueState> {
  const now = Date.now();
  const updated = { ...fatigueMap };

  for (const muscle of ALL_MUSCLE_GROUPS) {
    const entry = updated[muscle] ?? {
      muscle,
      recoveryPercent: 100,
      lastTrainedAt: null,
      recentSetsCount: 0
    };

    if (!entry.lastTrainedAt) {
      updated[muscle] = { ...entry, recoveryPercent: Math.min(100, entry.recoveryPercent) };
      continue;
    }

    const hoursElapsed = Math.max(0, (now - entry.lastTrainedAt) / (1000 * 60 * 60));
    const passiveRegen = Math.floor(hoursElapsed * 2.1);
    const effective = Math.min(100, Math.max(10, entry.recoveryPercent + passiveRegen));
    updated[muscle] = {
      ...entry,
      recoveryPercent: effective
    };
  }

  return updated;
}

export function getSystemArchitectAdvisory(
  profile: HunterProfile,
  fatigueMap: Record<MuscleGroup, MuscleFatigueState>
): {
  headline: string;
  directive: string;
  recommendedGateId: string;
  freshMuscles: MuscleGroup[];
  fatiguedMuscles: MuscleGroup[];
} {
  const current = computeCurrentMuscleRecovery(fatigueMap);
  const entries = Object.values(current);

  const freshMuscles = entries
    .filter((e) => e.recoveryPercent >= 80)
    .sort((a, b) => b.recoveryPercent - a.recoveryPercent)
    .map((e) => e.muscle);

  const fatiguedMuscles = entries
    .filter((e) => e.recoveryPercent < 65)
    .sort((a, b) => a.recoveryPercent - b.recoveryPercent)
    .map((e) => e.muscle);

  if (profile.penaltyZoneActive) {
    return {
      headline: '[ALARM] PENALTY QUEST PROTOCOL ACTIVE',
      directive:
        'Player failed to complete the previous Daily Quest cycle. Survive the Penalty Zone by completing the emergency burpee/squat survival quota immediately.',
      recommendedGateId: 'dungeon-calisthenics',
      freshMuscles,
      fatiguedMuscles
    };
  }

  if (profile.fatigue >= 75) {
    return {
      headline: '[SYSTEM WARNING] CRITICAL SYSTEM FATIGUE DETECTED',
      directive: `Overall Player Fatigue is at ${profile.fatigue}%. The Architect advises consuming a Purified Elixir of Life or running a low-impact Mobility / Calisthenics Gate.`,
      recommendedGateId: 'dungeon-calisthenics',
      freshMuscles,
      fatiguedMuscles
    };
  }

  const pushRecovery =
    ((current.Chest?.recoveryPercent ?? 100) +
      (current.Shoulders?.recoveryPercent ?? 100) +
      (current.Triceps?.recoveryPercent ?? 100)) /
    3;
  const pullRecovery =
    ((current.Back?.recoveryPercent ?? 100) + (current.Biceps?.recoveryPercent ?? 100)) / 2;
  const legsRecovery =
    ((current.Quads?.recoveryPercent ?? 100) +
      (current.Hamstrings?.recoveryPercent ?? 100) +
      (current.Core?.recoveryPercent ?? 100)) /
    3;

  if (profile.level >= 5 && !profile.shadowMonarchUnlocked && pushRecovery >= 75 && legsRecovery >= 75) {
    return {
      headline: '[HIDDEN QUEST AVAILABLE] THRONE OF BLOOD-RED IGRIS',
      directive:
        'Player has exceeded the threshold required for the Job Change Quest. Enter the S-Rank Boss Trial to awaken the Shadow Monarch class.',
      recommendedGateId: 'dungeon-igris-job',
      freshMuscles,
      fatiguedMuscles
    };
  }

  if (pushRecovery >= pullRecovery && pushRecovery >= legsRecovery) {
    return {
      headline: `[ARCHITECT ANALYSIS] PUSH CHAIN AT ${Math.round(pushRecovery)}% READINESS`,
      directive:
        'Pectorals, Anterior Deltoids, and Triceps show peak neuromuscular readiness. Entering the Demon Castle Push Gate will maximize STR growth today.',
      recommendedGateId: 'dungeon-push',
      freshMuscles,
      fatiguedMuscles
    };
  }

  if (pullRecovery >= pushRecovery && pullRecovery >= legsRecovery) {
    return {
      headline: `[ARCHITECT ANALYSIS] POSTERIOR PULL CHAIN AT ${Math.round(pullRecovery)}% READINESS`,
      directive:
        'Latissimus and Biceps recovery is optimal while pressing fibers regenerate. Enter the Cartenon Subterranean Pull Gate.',
      recommendedGateId: 'dungeon-pull',
      freshMuscles,
      fatiguedMuscles
    };
  }

  return {
    headline: `[ARCHITECT ANALYSIS] LOWER BODY ENGINE AT ${Math.round(legsRecovery)}% READINESS`,
    directive:
      'Quadriceps and Hamstrings are primed for high-gravity load. Conquer the Snowfield Red Gate (Legs & Core) for maximum XP and Tank Shadow extraction.',
    recommendedGateId: 'dungeon-legs',
    freshMuscles,
    fatiguedMuscles
  };
}

// Dynamically builds a custom Instant Dungeon Gate tailored to the Player's top 3 freshest muscle groups
export function generateAdaptiveInstantDungeon(
  profile: HunterProfile,
  fatigueMap: Record<MuscleGroup, MuscleFatigueState>
): DungeonTemplate {
  const current = computeCurrentMuscleRecovery(fatigueMap);
  const sortedMuscles = Object.values(current)
    .sort((a, b) => b.recoveryPercent - a.recoveryPercent)
    .map((m) => m.muscle);

  const targetMuscles = sortedMuscles.slice(0, 3);
  const allExercises: DungeonExerciseTemplate[] = [];
  const seenIds = new Set<string>();

  for (const dungeon of DUNGEON_TEMPLATES) {
    for (const ex of dungeon.exercises) {
      if (!seenIds.has(ex.id) && targetMuscles.includes(ex.muscleGroup)) {
        seenIds.add(ex.id);
        allExercises.push({
          ...ex,
          suggestedWeightKg: Math.round(ex.suggestedWeightKg * (1 + (profile.level - 1) * 0.04))
        });
      }
    }
  }

  const chosen = allExercises.slice(0, 4);

  return {
    id: `instant-gate-${Date.now()}`,
    dayCode: 'MON',
    dayLabel: 'INSTANT GATE',
    name: `Architect Instant Gate: ${targetMuscles.join(' + ')} Surge`,
    rank: profile.rank,
    gateType: 'Instant Dungeon',
    bossName: 'Architect’s Obsidian Statue',
    bossTitle: `Adaptive Lv.${profile.level} Sentinel`,
    description: `Procedurally synthesized by the System Architect targeting your freshest muscle groups (${targetMuscles.join(', ')}) for optimal hypertrophy with minimal overtraining risk.`,
    recommendedLevel: profile.level,
    xpReward: 480 + profile.level * 35,
    goldReward: 950 + profile.level * 60,
    shadowDropId: 'shadow-beru',
    exercises:
      chosen.length > 0
        ? chosen
        : DUNGEON_TEMPLATES[0].exercises.slice(0, 4)
  };
}
