/**
 * =====================================================================================
 * MYTHIC GAMBIT: REAL-TIME TACTICAL MOBA ACTION SIMULATOR ENGINE
 * =====================================================================================
 * Inspired by Mobile Legends: Bang Bang (MLBB) mechanics adapted for the official GDD.
 * Replaces turn-based 8x8 chess snapping with real-time vector locomotion, smart lock-ons,
 * kinetic basic attacks, active terrain hazard zones, and charging Queen Ultimates.
 *
 * Architecture: Entity-Component Framework + Hierarchical Finite State Machine (HFSM)
 * Authors: Lead Gameplay Engineer & AI Game Architect (for Marcial Lawrence Caronan Portfolio)
 * =====================================================================================
 */

// ==========================================
// 1. 2D VECTOR MATH & SPATIAL UTILITIES
// ==========================================
class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    const len = this.length();
    if (len > 0.00001) {
      this.x /= len;
      this.y /= len;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  distanceTo(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static lerp(a, b, t) {
    return new Vec2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  }

  static fromAngle(radians, length = 1) {
    return new Vec2(Math.cos(radians) * length, Math.sin(radians) * length);
  }
}

// ==========================================
// 2. OFFICIAL GDD REAL CHARACTERS DATABASE
// ==========================================
export const GDD_HEROES_ROSTER = {
  // --- THE OBSIDIAN ROOST (Fire & Draconic) ---
  ASH_MATRIARCH: {
    id: "ash_matriarch",
    name: "The Ash Matriarch",
    title: "Obsidian Queen of Cinders",
    kingdom: "obsidian",
    archetype: "QUEEN_BURST_MAGE",
    baseHp: 2850,
    baseArmor: 42,
    baseMagicResist: 36,
    baseMoveSpeed: 310, // Units per second
    attackRange: 280,   // Ranged projectile
    attackDamage: 145,
    attackSpeed: 1.15,  // Attacks per second
    collisionRadius: 28,
    passive: {
      name: "Heat Haze",
      type: "ZONE_AURA",
      radius: 200,
      accuracyPenalty: 0.25, // Enemies lose 25% accuracy/evasion
      description: "Thermal distortions obscure Allied units, causing hostile ranged attacks to glance or miss."
    },
    ultimate: {
      name: "Lava Torrent",
      type: "LINE_SKILLSHOT",
      range: 480,
      width: 90,
      energyCost: 100,
      baseDamage: 720,
      lingeringZoneDuration: 4.5, // Spawns magma terrain for 4.5s
      description: "Ruptures the planar crust, dealing 720 burst damage and forming lingering magma tiles."
    }
  },

  FLAME_WINGED_VANGUARD: {
    id: "flame_winged_vanguard",
    name: "Flame-Winged Vanguard",
    title: "Obsidian Knight Flanker",
    kingdom: "obsidian",
    archetype: "KNIGHT_ASSASSIN",
    baseHp: 2400,
    baseArmor: 48,
    baseMagicResist: 32,
    baseMoveSpeed: 360, // Highest mobility flanker
    attackRange: 85,    // Melee lunge
    attackDamage: 185,
    attackSpeed: 1.35,
    collisionRadius: 24,
    passive: {
      name: "Thermal Glide",
      type: "SELF_BUFF",
      moveSpeedBonus: 0.20,
      description: "Gains 20% bonus movement speed when traversing claimed magma terrain."
    },
    ultimate: {
      name: "Draconic Dive",
      type: "LEAP_TARGET",
      range: 360,
      energyCost: 100,
      baseDamage: 540,
      description: "Leaps over frontline terrain, striking the target unit with catastrophic thermal impact."
    }
  },

  MAGMA_BASTION: {
    id: "magma_bastion",
    name: "Magma Bastion",
    title: "Obsidian Siege Rook",
    kingdom: "obsidian",
    archetype: "ROOK_JUGGERNAUT",
    baseHp: 4400,
    baseArmor: 85,
    baseMagicResist: 60,
    baseMoveSpeed: 235, // Heavy defensive tank
    attackRange: 75,
    attackDamage: 120,
    attackSpeed: 0.85,
    collisionRadius: 36,
    passive: {
      name: "Obsidian Plating",
      type: "DAMAGE_MITIGATION",
      reductionPercent: 0.22,
      description: "Inherent obsidian stone reduces all incoming physical damage by 22%."
    },
    ultimate: {
      name: "Tectonic Fortress",
      type: "RADIAL_AOE",
      range: 180,
      energyCost: 100,
      baseDamage: 380,
      stunDuration: 1.6,
      description: "Slams into the ground, pulling nearby enemies and stunning them in volcanic slag."
    }
  },

  // --- THE VERDANT COURT (Nature & Enchantment) ---
  FOREST_MATRIARCH: {
    id: "forest_matriarch",
    name: "The Forest Matriarch",
    title: "Verdant Queen of Briars",
    kingdom: "verdant",
    archetype: "QUEEN_CONTROL_MAGE",
    baseHp: 2950,
    baseArmor: 40,
    baseMagicResist: 45,
    baseMoveSpeed: 305,
    attackRange: 300,
    attackDamage: 135,
    attackSpeed: 1.10,
    collisionRadius: 28,
    passive: {
      name: "Root-Bound Ground",
      type: "ZONE_AURA",
      radius: 220,
      slowPercent: 0.35,
      description: "Primeval briars entangle enemies entering the zone, reducing movement speed by 35%."
    },
    ultimate: {
      name: "Thorn Surge",
      type: "CONE_SKILLSHOT",
      range: 420,
      angle: Math.PI / 3, // 60 degree cone
      energyCost: 100,
      baseDamage: 650,
      rootDuration: 2.0,
      description: "Commands primeval thorns to erupt forward, rooting all caught enemies for 2.0 seconds."
    }
  },

  ANCIENT_TREANT: {
    id: "ancient_treant",
    name: "Ancient Treant",
    title: "Verdant Guardian Rook",
    kingdom: "verdant",
    archetype: "ROOK_JUGGERNAUT",
    baseHp: 4600,
    baseArmor: 78,
    baseMagicResist: 70,
    baseMoveSpeed: 230,
    attackRange: 80,
    attackDamage: 115,
    attackSpeed: 0.80,
    collisionRadius: 38,
    passive: {
      name: "Photosynthetic Bark",
      type: "REGENERATION",
      hpRegenPerSec: 35,
      description: "Regenerates 35 HP per second while standing on natural turf or claimed verdant tiles."
    },
    ultimate: {
      name: "Verdant Grasp",
      type: "RADIAL_AOE",
      range: 220,
      energyCost: 100,
      baseDamage: 320,
      stunDuration: 1.8,
      description: "Uproots massive wooden limbs to slam surrounding foes into the earth."
    }
  },

  // --- THE ABYSSAL TIDES (Water & Bioluminescence) ---
  LEVIATHAN_MATRIARCH: {
    id: "leviathan_matriarch",
    name: "Leviathan Matriarch",
    title: "Abyssal Queen of Trenches",
    kingdom: "abyssal",
    archetype: "QUEEN_DISRUPTOR_MAGE",
    baseHp: 3100,
    baseArmor: 44,
    baseMagicResist: 48,
    baseMoveSpeed: 315,
    attackRange: 275,
    attackDamage: 140,
    attackSpeed: 1.20,
    collisionRadius: 28,
    passive: {
      name: "Tidal Flow",
      type: "ZONE_AURA",
      radius: 210,
      speedBoostPercent: 0.25,
      description: "Generates shallow tide currents granting allied units +25% movement speed."
    },
    ultimate: {
      name: "Crushing Deluge",
      type: "LINE_SKILLSHOT",
      range: 520,
      width: 120,
      energyCost: 100,
      baseDamage: 700,
      knockbackDistance: 160,
      description: "Unleashes a tidal tsunami that sweeps away opposing units and knocks them back."
    }
  }
};

// ==========================================
// 3. UNIT HIERARCHICAL FINITE STATE MACHINE
// ==========================================
export const UnitState = Object.freeze({
  IDLE: "IDLE",
  MOVING: "MOVING",
  ATTACK_WINDUP: "ATTACK_WINDUP",
  ATTACK_RECOVERY: "ATTACK_RECOVERY",
  CASTING_ULTIMATE: "CASTING_ULTIMATE",
  MANIFESTATION_EXECUTION: "MANIFESTATION_EXECUTION", // Cinematic execution state
  STUNNED: "STUNNED",
  DEAD: "DEAD"
});

export class UnitStateMachine {
  constructor(unit) {
    this.unit = unit;
    this.currentState = UnitState.IDLE;
    this.stateTimer = 0;
    this.currentContext = null;
  }

  transitionTo(newState, context = {}) {
    if (this.currentState === UnitState.DEAD) return; // Terminal state

    // Exit logic
    this.onExitState(this.currentState);

    // Enter logic
    this.currentState = newState;
    this.stateTimer = 0;
    this.currentContext = context;
    this.onEnterState(newState, context);
  }

  onEnterState(state, context) {
    switch (state) {
      case UnitState.ATTACK_WINDUP:
        this.unit.velocity.set(0, 0); // Stutter-step anchor during windup
        this.stateTimer = context.windupTime || 0.22;
        break;

      case UnitState.ATTACK_RECOVERY:
        this.stateTimer = context.recoveryTime || 0.18;
        break;

      case UnitState.CASTING_ULTIMATE:
        this.unit.velocity.set(0, 0);
        this.unit.isInvulnerable = false;
        this.stateTimer = context.castDuration || 0.6;
        break;

      case UnitState.MANIFESTATION_EXECUTION:
        this.unit.velocity.set(0, 0);
        this.unit.isInvulnerable = true; // i-frames during execution
        this.stateTimer = context.executionDuration || 0.85;
        this.unit.onManifestationTrigger(context.victim);
        break;

      case UnitState.STUNNED:
        this.unit.velocity.set(0, 0);
        this.stateTimer = context.duration || 1.0;
        break;

      case UnitState.DEAD:
        this.unit.velocity.set(0, 0);
        this.unit.isDead = true;
        break;
    }
  }

  onExitState(state) {
    if (state === UnitState.MANIFESTATION_EXECUTION) {
      this.unit.isInvulnerable = false; // Remove i-frame protection
    }
  }

  update(dt) {
    if (this.currentState === UnitState.DEAD) return;

    if (this.stateTimer > 0) {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.onTimerExpired();
      }
    }
  }

  onTimerExpired() {
    switch (this.currentState) {
      case UnitState.ATTACK_WINDUP:
        // Execute damage point at end of windup
        this.unit.executeBasicAttackHit(this.currentContext.target);
        this.transitionTo(UnitState.ATTACK_RECOVERY, this.currentContext);
        break;

      case UnitState.ATTACK_RECOVERY:
        this.transitionTo(this.unit.inputVector.lengthSq() > 0 ? UnitState.MOVING : UnitState.IDLE);
        break;

      case UnitState.CASTING_ULTIMATE:
        this.unit.executeUltimateSkill(this.currentContext);
        this.transitionTo(UnitState.IDLE);
        break;

      case UnitState.MANIFESTATION_EXECUTION:
        this.transitionTo(UnitState.IDLE);
        break;

      case UnitState.STUNNED:
        this.transitionTo(UnitState.IDLE);
        break;
    }
  }
}

// ==========================================
// 4. MLBB-STYLE VECTOR MOVEMENT CONTROLLER
// ==========================================
export class PlayerMovementController {
  constructor(arenaBounds) {
    this.arenaBounds = arenaBounds || { minX: 40, maxX: 960, minY: 40, maxY: 660 };
    this.inputVector = new Vec2(0, 0); // Joystick or WASD raw axis
    this.smoothedVelocity = new Vec2(0, 0);
    this.acceleration = 1800; // Units/s^2 for responsive snappy turnarounds
    this.friction = 1400;     // Braking decel
  }

  setJoystickInput(x, y) {
    this.inputVector.set(x, y);
    if (this.inputVector.lengthSq() > 1.0) {
      this.inputVector.normalize();
    }
  }

  update(unit, dt) {
    if (
      unit.stateMachine.currentState === UnitState.ATTACK_WINDUP ||
      unit.stateMachine.currentState === UnitState.CASTING_ULTIMATE ||
      unit.stateMachine.currentState === UnitState.MANIFESTATION_EXECUTION ||
      unit.stateMachine.currentState === UnitState.STUNNED ||
      unit.stateMachine.currentState === UnitState.DEAD
    ) {
      // Movement locked during skill windup/execution/stun
      unit.velocity.set(0, 0);
      return;
    }

    const hasInput = this.inputVector.lengthSq() > 0.01;
    const targetSpeed = unit.getEffectiveMoveSpeed();

    if (hasInput) {
      // Accelerate towards input vector
      const desiredVel = this.inputVector.clone().scale(targetSpeed);
      this.smoothedVelocity.x = Math.fround(this.approach(this.smoothedVelocity.x, desiredVel.x, this.acceleration * dt));
      this.smoothedVelocity.y = Math.fround(this.approach(this.smoothedVelocity.y, desiredVel.y, this.acceleration * dt));

      // Face direction of movement
      unit.facingAngle = Math.atan2(this.smoothedVelocity.y, this.smoothedVelocity.x);

      if (unit.stateMachine.currentState !== UnitState.MOVING && unit.stateMachine.currentState !== UnitState.ATTACK_RECOVERY) {
        unit.stateMachine.transitionTo(UnitState.MOVING);
      }
    } else {
      // Apply friction decel
      this.smoothedVelocity.x = Math.fround(this.approach(this.smoothedVelocity.x, 0, this.friction * dt));
      this.smoothedVelocity.y = Math.fround(this.approach(this.smoothedVelocity.y, 0, this.friction * dt));

      if (this.smoothedVelocity.lengthSq() < 10 && unit.stateMachine.currentState === UnitState.MOVING) {
        unit.stateMachine.transitionTo(UnitState.IDLE);
      }
    }

    // Integrate Position
    unit.position.x += this.smoothedVelocity.x * dt;
    unit.position.y += this.smoothedVelocity.y * dt;
    unit.velocity.set(this.smoothedVelocity.x, this.smoothedVelocity.y);

    // Arena boundary clamp
    unit.position.x = Math.max(this.arenaBounds.minX + unit.collisionRadius, Math.min(this.arenaBounds.maxX - unit.collisionRadius, unit.position.x));
    unit.position.y = Math.max(this.arenaBounds.minY + unit.collisionRadius, Math.min(this.arenaBounds.maxY - unit.collisionRadius, unit.position.y));
  }

  approach(current, target, maxDelta) {
    if (current < target) {
      return Math.min(current + maxDelta, target);
    } else {
      return Math.max(current - maxDelta, target);
    }
  }
}

// ==========================================
// 5. MLBB SMART LOCK-ON TARGETING & COMBAT
// ==========================================
export class CombatTargetingSystem {
  constructor(arena) {
    this.arena = arena;
  }

  /**
   * MLBB Smart Lock-On Algorithm:
   * 1. Query all enemies within unit's acquisition perimeter
   * 2. Priority: Target with Lowest HP Percentage (to secure executions)
   * 3. Secondary: Target closest to the center targeting cone
   */
  findBestLockOnTarget(sourceUnit, maxRange = 400) {
    const enemies = this.arena.getEnemyUnits(sourceUnit.team);
    let bestTarget = null;
    let lowestHpPercent = 1.01;
    let closestDistance = Infinity;

    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      const dist = sourceUnit.position.distanceTo(enemy.position);

      if (dist <= maxRange) {
        const hpPercent = enemy.currentHp / enemy.maxHp;

        // Priority 1: Lowest HP%
        if (hpPercent < lowestHpPercent - 0.05) {
          lowestHpPercent = hpPercent;
          closestDistance = dist;
          bestTarget = enemy;
        } else if (Math.abs(hpPercent - lowestHpPercent) <= 0.05 && dist < closestDistance) {
          // Priority 2: Closest distance tie-breaker
          closestDistance = dist;
          bestTarget = enemy;
        }
      }
    }
    return bestTarget;
  }

  triggerBasicAttack(sourceUnit) {
    if (
      sourceUnit.stateMachine.currentState === UnitState.ATTACK_WINDUP ||
      sourceUnit.stateMachine.currentState === UnitState.CASTING_ULTIMATE ||
      sourceUnit.stateMachine.currentState === UnitState.MANIFESTATION_EXECUTION ||
      sourceUnit.stateMachine.currentState === UnitState.STUNNED
    ) {
      return false; // Can't attack during busy states
    }

    const target = sourceUnit.lockedTarget || this.findBestLockOnTarget(sourceUnit, sourceUnit.attackRange * 1.3);
    if (!target) return false;

    const dist = sourceUnit.position.distanceTo(target.position);
    if (dist > sourceUnit.attackRange) {
      // MLBB auto-pursuit vector
      const approachDir = target.position.clone().sub(sourceUnit.position).normalize();
      sourceUnit.movementController.setJoystickInput(approachDir.x, approachDir.y);
      return false;
    }

    // Snap orientation towards locked target
    sourceUnit.facingAngle = Math.atan2(target.position.y - sourceUnit.position.y, target.position.x - sourceUnit.position.x);

    // Transition to ATTACK_WINDUP state
    const windupTime = 1.0 / (sourceUnit.attackSpeed * 2.2);
    const recoveryTime = 1.0 / (sourceUnit.attackSpeed * 2.5);

    sourceUnit.stateMachine.transitionTo(UnitState.ATTACK_WINDUP, {
      target,
      windupTime,
      recoveryTime
    });

    return true;
  }
}

// ==========================================
// 6. ACTIVE ZONE CONTROL & 15 KINGDOM PASSIVES
// ==========================================
export class TerrainZoneManager {
  constructor() {
    this.activeZones = []; // List of active AoE field circles/polygons
  }

  spawnZone(config) {
    const zone = {
      id: "zone_" + Math.random().toString(36).substr(2, 9),
      x: config.x,
      y: config.y,
      radius: config.radius || 120,
      duration: config.duration || 6.0,
      elapsed: 0,
      kingdom: config.kingdom,
      type: config.type, // 'HEAT_HAZE', 'ROOT_BOUND', 'TIDAL_FLOW', 'PERMAFROST'
      ownerTeam: config.ownerTeam,
      color: config.color || "rgba(239, 68, 68, 0.35)",
      applyTick: config.applyTick
    };
    this.activeZones.push(zone);
    return zone;
  }

  update(units, dt) {
    for (let i = this.activeZones.length - 1; i >= 0; i--) {
      const zone = this.activeZones[i];
      zone.elapsed += dt;

      // Spatial collision check with all active units
      for (const unit of units) {
        if (unit.isDead) continue;
        const dist = Math.sqrt((unit.position.x - zone.x) ** 2 + (unit.position.y - zone.y) ** 2);

        if (dist <= zone.radius + unit.collisionRadius) {
          this.applyZoneEffect(zone, unit, dt);
        }
      }

      if (zone.elapsed >= zone.duration) {
        this.activeZones.splice(i, 1); // Expire zone
      }
    }
  }

  applyZoneEffect(zone, unit, dt) {
    const isFriendly = unit.team === zone.ownerTeam;

    switch (zone.type) {
      case "HEAT_HAZE": // The Obsidian Roost
        if (!isFriendly) {
          unit.addBuff({ id: "heat_haze_debuff", duration: 0.5, accuracyDebuff: 0.25 });
        }
        break;

      case "ROOT_BOUND": // The Verdant Court
        if (!isFriendly) {
          unit.addBuff({ id: "root_bound_slow", duration: 0.5, slowPercent: 0.45 });
        }
        break;

      case "TIDAL_FLOW": // The Abyssal Tides
        if (isFriendly) {
          unit.addBuff({ id: "tidal_flow_haste", duration: 0.5, speedBoostPercent: 0.30 });
        }
        break;

      case "PERMAFROST": // The Frostbound Reach
        if (!isFriendly) {
          unit.addBuff({ id: "permafrost_chill", duration: 0.5, slowPercent: 0.35, attackSpeedSlow: 0.25 });
        }
        break;
    }
  }
}

// ==========================================
// 7. ULTIMATE SKILL COOLDOWN & CHARGING SYSTEM
// ==========================================
export class UltimateSkillCaster {
  constructor(unit, arena) {
    this.unit = unit;
    this.arena = arena;
    this.currentEnergy = 0;
    this.maxEnergy = 100;
    this.isAiming = false;
    this.aimVector = new Vec2(1, 0);
  }

  addEnergy(amount) {
    this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + amount);
  }

  isReady() {
    return this.currentEnergy >= this.maxEnergy;
  }

  startAiming(aimVector) {
    if (!this.isReady()) return false;
    this.isAiming = true;
    if (aimVector) this.aimVector = aimVector.normalize();
    return true;
  }

  updateAim(dx, dy) {
    if (!this.isAiming) return;
    this.aimVector.set(dx, dy).normalize();
  }

  castUltimate() {
    if (!this.isReady()) return false;

    this.isAiming = false;
    this.currentEnergy = 0; // Consume charge

    // Transition to CASTING_ULTIMATE
    this.unit.stateMachine.transitionTo(UnitState.CASTING_ULTIMATE, {
      aimVector: this.aimVector.clone(),
      castDuration: 0.55
    });

    return true;
  }

  executeCast(context) {
    const heroDef = this.unit.heroDef;
    const ult = heroDef.ultimate;
    const origin = this.unit.position.clone();
    const dir = context.aimVector || Vec2.fromAngle(this.unit.facingAngle);

    // Audio/FX Trigger
    this.arena.onUltimateDischarge(this.unit, ult);

    switch (ult.type) {
      case "LINE_SKILLSHOT": {
        // e.g. Lava Torrent (Ash Matriarch) or Crushing Deluge (Leviathan Matriarch)
        const enemies = this.arena.getEnemyUnits(this.unit.team);
        for (const enemy of enemies) {
          if (enemy.isDead) continue;
          // Vector projection from origin along dir line segment
          const toEnemy = enemy.position.clone().sub(origin);
          const projDist = toEnemy.x * dir.x + toEnemy.y * dir.y;

          if (projDist >= 0 && projDist <= ult.range) {
            const perpDist = Math.abs(toEnemy.x * -dir.y + toEnemy.y * dir.x);
            if (perpDist <= ult.width / 2 + enemy.collisionRadius) {
              enemy.takeDamage(ult.baseDamage, "MAGIC", this.unit);
            }
          }
        }

        // Spawn lingering kingdom terrain
        this.arena.terrainManager.spawnZone({
          x: origin.x + dir.x * (ult.range * 0.5),
          y: origin.y + dir.y * (ult.range * 0.5),
          radius: ult.range * 0.45,
          duration: ult.lingeringZoneDuration || 5.0,
          type: heroDef.kingdom === "obsidian" ? "HEAT_HAZE" : "TIDAL_FLOW",
          ownerTeam: this.unit.team
        });
        break;
      }

      case "CONE_SKILLSHOT": {
        // e.g. Thorn Surge (Forest Matriarch)
        const enemies = this.arena.getEnemyUnits(this.unit.team);
        for (const enemy of enemies) {
          if (enemy.isDead) continue;
          const dist = origin.distanceTo(enemy.position);
          if (dist <= ult.range) {
            const toEnemy = enemy.position.clone().sub(origin).normalize();
            const dot = dir.x * toEnemy.x + dir.y * toEnemy.y;
            const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

            if (angle <= ult.angle / 2) {
              enemy.takeDamage(ult.baseDamage, "MAGIC", this.unit);
              enemy.applyStun(ult.rootDuration || 2.0);
            }
          }
        }

        // Spawn Verdant Root-Bound briar zone
        this.arena.terrainManager.spawnZone({
          x: origin.x + dir.x * (ult.range * 0.6),
          y: origin.y + dir.y * (ult.range * 0.6),
          radius: ult.range * 0.5,
          duration: 6.0,
          type: "ROOT_BOUND",
          ownerTeam: this.unit.team
        });
        break;
      }
    }
  }
}

// ==========================================
// 8. UNIFIED MOBA CHARACTER ENTITY
// ==========================================
export class MobaHeroUnit {
  constructor(heroDefKey, team = "BLUE", startX = 200, startY = 350, arena = null) {
    this.heroDef = GDD_HEROES_ROSTER[heroDefKey] || GDD_HEROES_ROSTER.ASH_MATRIARCH;
    this.team = team;
    this.arena = arena;

    // Attributes
    this.maxHp = this.heroDef.baseHp;
    this.currentHp = this.maxHp;
    this.armor = this.heroDef.baseArmor;
    this.magicResist = this.heroDef.baseMagicResist;
    this.baseMoveSpeed = this.heroDef.baseMoveSpeed;
    this.attackRange = this.heroDef.attackRange;
    this.attackDamage = this.heroDef.attackDamage;
    this.attackSpeed = this.heroDef.attackSpeed;
    this.collisionRadius = this.heroDef.collisionRadius;

    // Spatial Vectors
    this.position = new Vec2(startX, startY);
    this.velocity = new Vec2(0, 0);
    this.inputVector = new Vec2(0, 0);
    this.facingAngle = team === "BLUE" ? 0 : Math.PI;

    // Combat & Buff State
    this.isDead = false;
    this.isInvulnerable = false;
    this.lockedTarget = null;
    this.activeBuffs = [];

    // Subsystems
    this.stateMachine = new UnitStateMachine(this);
    this.movementController = new PlayerMovementController();
    this.ultimateCaster = new UltimateSkillCaster(this, arena);
  }

  update(dt) {
    if (this.isDead) return;

    // 1. Update Active Buffs/Debuffs
    this.updateBuffs(dt);

    // 2. Update Movement Controller
    this.movementController.update(this, dt);

    // 3. Update Finite State Machine
    this.stateMachine.update(dt);

    // 4. Passive Energy Charge from combat proximity
    if (this.arena) {
      const nearestEnemy = this.arena.getNearestEnemy(this);
      if (nearestEnemy && this.position.distanceTo(nearestEnemy.position) < 320) {
        this.ultimateCaster.addEnergy(2.5 * dt); // Proximity adrenaline charge
      }
    }
  }

  getEffectiveMoveSpeed() {
    let speed = this.baseMoveSpeed;
    for (const buff of this.activeBuffs) {
      if (buff.speedBoostPercent) speed *= 1 + buff.speedBoostPercent;
      if (buff.slowPercent) speed *= 1 - buff.slowPercent;
    }
    return Math.max(120, speed);
  }

  addBuff(buff) {
    const existing = this.activeBuffs.find(b => b.id === buff.id);
    if (existing) {
      existing.duration = Math.max(existing.duration, buff.duration);
    } else {
      this.activeBuffs.push({ ...buff });
    }
  }

  updateBuffs(dt) {
    for (let i = this.activeBuffs.length - 1; i >= 0; i--) {
      this.activeBuffs[i].duration -= dt;
      if (this.activeBuffs[i].duration <= 0) {
        this.activeBuffs.splice(i, 1);
      }
    }
  }

  executeBasicAttackHit(target) {
    if (!target || target.isDead) return;

    // Damage Formula with Physical Armor Reduction: Damage = Raw * (100 / (100 + Armor))
    const damage = Math.round(this.attackDamage * (100 / (100 + target.armor)));
    target.takeDamage(damage, "PHYSICAL", this);

    // Charge Ultimate on successful attack
    this.ultimateCaster.addEnergy(8.0);
  }

  executeUltimateSkill(context) {
    this.ultimateCaster.executeCast(context);
  }

  takeDamage(amount, type = "PHYSICAL", attacker = null) {
    if (this.isDead || this.isInvulnerable) return;

    this.currentHp = Math.max(0, this.currentHp - amount);

    // Ultimate counter-charge when receiving damage
    this.ultimateCaster.addEnergy(4.0);

    // Spawn floating damage indicator
    if (this.arena) {
      this.arena.spawnDamagePopup(this.position.x, this.position.y - 25, amount, type);
    }

    if (this.currentHp <= 0) {
      this.die(attacker);
    }
  }

  applyStun(duration) {
    if (this.isDead || this.isInvulnerable) return;
    this.stateMachine.transitionTo(UnitState.STUNNED, { duration });
  }

  die(killer) {
    this.isDead = true;
    this.stateMachine.transitionTo(UnitState.DEAD);

    // Seamless Manifestation Execution Trigger on Slaying Blow
    if (killer && killer.stateMachine.currentState !== UnitState.DEAD) {
      killer.stateMachine.transitionTo(UnitState.MANIFESTATION_EXECUTION, {
        victim: this,
        executionDuration: 0.75
      });
    }

    if (this.arena) {
      this.arena.onUnitSlain(this, killer);
    }
  }

  onManifestationTrigger(victim) {
    // Kingdom Execution Surge: +20% move speed and spawn faction terrain on corpse
    this.addBuff({ id: "manifestation_surge", duration: 3.5, speedBoostPercent: 0.20 });

    if (this.arena) {
      this.arena.triggerManifestationFX(this, victim);
      this.arena.terrainManager.spawnZone({
        x: victim.position.x,
        y: victim.position.y,
        radius: 140,
        duration: 8.0,
        type: this.heroDef.kingdom === "obsidian" ? "HEAT_HAZE" : "ROOT_BOUND",
        ownerTeam: this.team
      });
    }
  }
}

// ==========================================
// 9. ARENA ENGINE ORCHESTRATOR & GAME LOOP
// ==========================================
export class MythicGambitArenaEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext("2d") : null;
    this.width = canvasElement ? canvasElement.width : 960;
    this.height = canvasElement ? canvasElement.height : 600;

    this.units = [];
    this.damagePopups = [];
    this.manifestationFXs = [];
    this.terrainManager = new TerrainZoneManager();
    this.targetingSystem = new CombatTargetingSystem(this);

    this.playerUnit = null;
    this.lastTime = 0;
    this.isRunning = false;

    this.initDefaultMatchup();
  }

  initDefaultMatchup() {
    this.units = [];
    this.terrainManager.activeZones = [];

    // Player Team (Blue - The Obsidian Roost)
    this.playerUnit = new MobaHeroUnit("ASH_MATRIARCH", "BLUE", 180, 300, this);
    const allyKnight = new MobaHeroUnit("FLAME_WINGED_VANGUARD", "BLUE", 120, 200, this);
    const allyRook = new MobaHeroUnit("MAGMA_BASTION", "BLUE", 120, 400, this);

    // Opponent Team (Red - The Verdant Court)
    const enemyQueen = new MobaHeroUnit("FOREST_MATRIARCH", "RED", 780, 300, this);
    const enemyTreant = new MobaHeroUnit("ANCIENT_TREANT", "RED", 700, 380, this);

    this.units.push(this.playerUnit, allyKnight, allyRook, enemyQueen, enemyTreant);
  }

  getEnemyUnits(myTeam) {
    return this.units.filter(u => u.team !== myTeam && !u.isDead);
  }

  getAlliedUnits(myTeam) {
    return this.units.filter(u => u.team === myTeam && !u.isDead);
  }

  getNearestEnemy(unit) {
    let nearest = null;
    let minDist = Infinity;
    for (const enemy of this.getEnemyUnits(unit.team)) {
      const d = unit.position.distanceTo(enemy.position);
      if (d < minDist) {
        minDist = d;
        nearest = enemy;
      }
    }
    return nearest;
  }

  spawnDamagePopup(x, y, amount, type) {
    this.damagePopups.push({
      x: x + (Math.random() - 0.5) * 20,
      y,
      amount,
      type,
      alpha: 1.0,
      lifespan: 0.8
    });
  }

  triggerManifestationFX(killer, victim) {
    this.manifestationFXs.push({
      x: victim.position.x,
      y: victim.position.y,
      killerName: killer.heroDef.name,
      victimName: victim.heroDef.name,
      kingdom: killer.heroDef.kingdom,
      radius: 30,
      maxRadius: 160,
      alpha: 1.0,
      lifespan: 1.2
    });
  }

  onUnitSlain(victim, killer) {
    console.log(`[MYTHIC GAMBIT] ${killer ? killer.heroDef.name : 'Unknown'} executed ${victim.heroDef.name}!`);
  }

  onUltimateDischarge(unit, ult) {
    console.log(`[ULTIMATE] ${unit.heroDef.name} unleashed ${ult.name}!`);
  }

  update(dt) {
    // 1. Update all units
    for (const unit of this.units) {
      // Auto-target lock for player
      if (unit === this.playerUnit) {
        unit.lockedTarget = this.targetingSystem.findBestLockOnTarget(unit, 420);
      } else if (!unit.isDead) {
        // Simple AI Routine for non-player units
        this.updateAIUnit(unit, dt);
      }
      unit.update(dt);
    }

    // 2. Unit-to-unit soft circle collision resolution
    this.resolveUnitCollisions();

    // 3. Update Terrain Zones
    this.terrainManager.update(this.units, dt);

    // 4. Update Damage Popups
    for (let i = this.damagePopups.length - 1; i >= 0; i--) {
      const p = this.damagePopups[i];
      p.y -= 35 * dt;
      p.lifespan -= dt;
      p.alpha = Math.max(0, p.lifespan / 0.8);
      if (p.lifespan <= 0) this.damagePopups.splice(i, 1);
    }

    // 5. Update Manifestation FX
    for (let i = this.manifestationFXs.length - 1; i >= 0; i--) {
      const fx = this.manifestationFXs[i];
      fx.radius += (fx.maxRadius - fx.radius) * 8 * dt;
      fx.lifespan -= dt;
      fx.alpha = Math.max(0, fx.lifespan / 1.2);
      if (fx.lifespan <= 0) this.manifestationFXs.splice(i, 1);
    }
  }

  updateAIUnit(unit, dt) {
    const enemies = this.getEnemyUnits(unit.team);
    if (enemies.length === 0) {
      unit.movementController.setJoystickInput(0, 0);
      return;
    }

    const target = this.targetingSystem.findBestLockOnTarget(unit, 600);
    if (!target) return;

    const dist = unit.position.distanceTo(target.position);

    if (dist > unit.attackRange * 0.85) {
      // Chase target
      const dir = target.position.clone().sub(unit.position).normalize();
      unit.movementController.setJoystickInput(dir.x, dir.y);
    } else {
      // Within attack range: stop and attack
      unit.movementController.setJoystickInput(0, 0);
      if (unit.ultimateCaster.isReady()) {
        const aimDir = target.position.clone().sub(unit.position).normalize();
        unit.ultimateCaster.startAiming(aimDir);
        unit.ultimateCaster.castUltimate();
      } else {
        this.targetingSystem.triggerBasicAttack(unit);
      }
    }
  }

  resolveUnitCollisions() {
    for (let i = 0; i < this.units.length; i++) {
      for (let j = i + 1; j < this.units.length; j++) {
        const u1 = this.units[i];
        const u2 = this.units[j];
        if (u1.isDead || u2.isDead) continue;

        const dist = u1.position.distanceTo(u2.position);
        const minDist = u1.collisionRadius + u2.collisionRadius;

        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          const normal = u1.position.clone().sub(u2.position).normalize();

          // Push apart proportionally
          u1.position.add(normal.clone().scale(overlap * 0.5));
          u2.position.sub(normal.clone().scale(overlap * 0.5));
        }
      }
    }
  }
}

