import { Injectable, computed, signal, inject } from '@angular/core';
import {
  CharacterClass,
  CLASSES,
  HatItem,
  HATS,
  OutfitItem,
  OUTFITS,
  WeaponItem,
  WEAPONS,
  SpecialPower,
  SPECIAL_POWERS,
  RpgStats,
  CharacterPreset,
  PRESETS
} from '../models/character.model';
import { SoundEffectsService } from './sound-effects.service';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class CharacterStateService {
  private sound = inject(SoundEffectsService);

  // Core Signals
  readonly characterName = signal<string>('Ignis Flareheart');
  readonly selectedClass = signal<CharacterClass>(CLASSES[0]);
  readonly skinColor = signal<string>('#fbbf24');
  readonly selectedHat = signal<HatItem>(HATS[0]);
  readonly selectedOutfit = signal<OutfitItem>(OUTFITS[0]);
  readonly selectedWeapon = signal<WeaponItem>(WEAPONS[0]);
  readonly powerActive = signal<boolean>(true);
  readonly selectedPower = signal<SpecialPower>(SPECIAL_POWERS[0]);
  readonly stats = signal<RpgStats>({ strength: 16, agility: 8, magic: 6 });
  readonly availableStatPoints = signal<number>(5);

  // Presentation & UI Signals
  readonly presenterMode = signal<boolean>(false);
  readonly codePeekerOpen = signal<boolean>(false);
  readonly activeCodeTab = signal<'signals' | 'bindings' | 'directives' | 'state'>('signals');
  readonly isAttacking = signal<boolean>(false);

  // Track the most recently modified signal to drive dynamic code highlight in Code Peeker
  readonly lastUpdatedSignal = signal<{ name: string; timestamp: number; value: string }>({
    name: 'characterName',
    timestamp: Date.now(),
    value: 'Ignis Flareheart'
  });

  // Computed Signal: Total Attack Power
  readonly totalAttackPower = computed(() => {
    const weapon = this.selectedWeapon();
    const st = this.stats();
    const hat = this.selectedHat();
    const power = this.selectedPower();
    const isPowerOn = this.powerActive();

    // Base weapon damage
    let damage = weapon.baseDamage;

    // Stat scaling
    if (weapon.scalingStat === 'strength') {
      damage += (st.strength + hat.strengthBonus) * 2.4;
      damage += (st.agility + hat.agilityBonus) * 0.4;
    } else if (weapon.scalingStat === 'agility') {
      damage += (st.agility + hat.agilityBonus) * 2.5;
      damage += (st.strength + hat.strengthBonus) * 0.3;
    } else {
      damage += (st.magic + hat.magicBonus) * 2.6;
      damage += (st.agility + hat.agilityBonus) * 0.3;
    }

    // Synergy bonus: If power element matches weapon element
    if (isPowerOn && power.element === weapon.element) {
      damage += 18; // Resonance bonus
    }

    // Special power multiplier
    if (isPowerOn) {
      damage *= power.powerMultiplier;
    }

    return Math.round(damage);
  });

  // Computed Signal: Total Defense Rating
  readonly defenseRating = computed(() => {
    const outfit = this.selectedOutfit();
    const st = this.stats();
    const hat = this.selectedHat();
    return outfit.defense + Math.round(st.strength * 0.6) + hat.strengthBonus * 2;
  });

  // Computed Signal: Critical Strike Chance (%)
  readonly critChance = computed(() => {
    const st = this.stats();
    const hat = this.selectedHat();
    const totalAgi = st.agility + hat.agilityBonus;
    return Math.min(80, Math.round(5 + totalAgi * 1.7));
  });

  // Computed Signal: Mana Pool
  readonly manaPool = computed(() => {
    const st = this.stats();
    const hat = this.selectedHat();
    const totalMag = st.magic + hat.magicBonus;
    return 60 + totalMag * 14;
  });

  // Computed Signal: Weapon Synergy Details
  readonly weaponSynergy = computed(() => {
    const weapon = this.selectedWeapon();
    const power = this.selectedPower();
    const isPowerOn = this.powerActive();
    const cls = this.selectedClass();

    const matchesClass = cls.primaryStat === weapon.scalingStat;
    const matchesElement = isPowerOn && power.element === weapon.element;

    if (matchesClass && matchesElement) {
      return {
        level: 'Perfect Resonance',
        bonus: '+35% Total Combat Power',
        active: true,
        description: `${cls.name} wielding native ${weapon.scalingStat.toUpperCase()} gear with matched ${power.element.toUpperCase()} aura!`
      };
    } else if (matchesElement) {
      return {
        level: 'Elemental Harmony',
        bonus: '+18 Flat Elemental Bonus',
        active: true,
        description: `Weapon element (${weapon.element}) matches Aura element!`
      };
    } else if (matchesClass) {
      return {
        level: 'Class Affinity',
        bonus: 'Max Stat Scaling Active',
        active: true,
        description: `Weapon scales directly from ${cls.primaryStat.toUpperCase()}!`
      };
    }

    return {
      level: 'Standard Setup',
      bonus: 'No extra resonance',
      active: false,
      description: 'Switch weapon or power to activate elemental resonance.'
    };
  });

  // Computed Signal: Dynamic RPG Title
  readonly characterTitle = computed(() => {
    const name = this.characterName().trim() || 'Hero';
    const cls = this.selectedClass();
    const weapon = this.selectedWeapon();
    const power = this.selectedPower();
    const isPowerOn = this.powerActive();

    if (isPowerOn) {
      if (weapon.element === 'flame') return `${name} the Sun-Forged Champion`;
      if (weapon.element === 'frost') return `${name} the Glacial Sovereign`;
      if (weapon.element === 'lightning') return `${name} the Storm Sovereign`;
      return `${name} the Void Harbinger`;
    }

    return `${name} the ${cls.name}`;
  });

  // Signal Mutators
  setName(name: string): void {
    this.characterName.set(name);
    this.recordSignalChange('characterName', name);
  }

  setClass(cls: CharacterClass): void {
    this.selectedClass.set(cls);
    this.sound.playClick();
    this.recordSignalChange('selectedClass', cls.name);
  }

  setSkinColor(color: string): void {
    this.skinColor.set(color);
    this.sound.playClick();
    this.recordSignalChange('skinColor', color);
  }

  setHat(hat: HatItem): void {
    this.selectedHat.set(hat);
    this.sound.playClick();
    this.recordSignalChange('selectedHat', hat.name);
  }

  setOutfit(outfit: OutfitItem): void {
    this.selectedOutfit.set(outfit);
    this.sound.playClick();
    this.recordSignalChange('selectedOutfit', outfit.name);
  }

  setWeapon(weapon: WeaponItem): void {
    this.selectedWeapon.set(weapon);
    this.sound.playEquipWeapon(weapon.element);
    this.recordSignalChange('selectedWeapon', weapon.name);
  }

  togglePower(): void {
    const next = !this.powerActive();
    this.powerActive.set(next);
    this.sound.playPowerToggle(next);
    this.recordSignalChange('powerActive', String(next));
  }

  setPower(power: SpecialPower): void {
    this.selectedPower.set(power);
    this.sound.playEquipWeapon(power.element);
    this.recordSignalChange('selectedPower', power.name);
  }

  increaseStat(statName: keyof RpgStats): void {
    const currentPoints = this.availableStatPoints();
    if (currentPoints <= 0) return;

    this.stats.update((st) => ({
      ...st,
      [statName]: st[statName] + 1
    }));
    this.availableStatPoints.set(currentPoints - 1);
    this.sound.playStatChange(true);
    this.recordSignalChange('stats', `${statName}: ${this.stats()[statName]}`);

    if (currentPoints - 1 === 0) {
      this.fireConfetti();
    }
  }

  decreaseStat(statName: keyof RpgStats): void {
    const st = this.stats();
    if (st[statName] <= 2) return; // Minimum floor

    this.stats.update((prev) => ({
      ...prev,
      [statName]: prev[statName] - 1
    }));
    this.availableStatPoints.update((pts) => pts + 1);
    this.sound.playStatChange(false);
    this.recordSignalChange('stats', `${statName}: ${this.stats()[statName]}`);
  }

  resetStats(): void {
    this.stats.set({ strength: 10, agility: 10, magic: 10 });
    this.availableStatPoints.set(10);
    this.sound.playClick();
    this.recordSignalChange('stats', 'Reset to 10/10/10');
  }

  loadPreset(preset: CharacterPreset): void {
    this.characterName.set(preset.name);
    const cls = CLASSES.find((c) => c.id === preset.characterClass) || CLASSES[0];
    const hat = HATS.find((h) => h.id === preset.hatId) || HATS[0];
    const outfit = OUTFITS.find((o) => o.id === preset.outfitId) || OUTFITS[0];
    const weapon = WEAPONS.find((w) => w.id === preset.weaponId) || WEAPONS[0];
    const power = SPECIAL_POWERS.find((p) => p.id === preset.powerId) || SPECIAL_POWERS[0];

    this.selectedClass.set(cls);
    this.skinColor.set(preset.skinColor);
    this.selectedHat.set(hat);
    this.selectedOutfit.set(outfit);
    this.selectedWeapon.set(weapon);
    this.powerActive.set(preset.powerActive);
    this.selectedPower.set(power);
    this.stats.set({ ...preset.stats });
    this.availableStatPoints.set(0);

    this.sound.playEquipWeapon(weapon.element);
    this.recordSignalChange('preset', preset.name);
    this.fireConfetti();
  }

  togglePresenterMode(): void {
    const next = !this.presenterMode();
    this.presenterMode.set(next);
    this.sound.playClick();
    this.recordSignalChange('presenterMode', String(next));
  }

  toggleCodePeeker(): void {
    const next = !this.codePeekerOpen();
    this.codePeekerOpen.set(next);
    this.sound.playClick();
  }

  openCodePeekerWithTab(tab: 'signals' | 'bindings' | 'directives' | 'state'): void {
    this.activeCodeTab.set(tab);
    this.codePeekerOpen.set(true);
    this.sound.playClick();
  }

  setCodeTab(tab: 'signals' | 'bindings' | 'directives' | 'state'): void {
    this.activeCodeTab.set(tab);
    this.sound.playClick();
  }

  triggerAttack(): void {
    if (this.isAttacking()) return;
    this.isAttacking.set(true);
    this.sound.playAttackSlice();
    setTimeout(() => {
      this.isAttacking.set(false);
    }, 450);
  }

  private recordSignalChange(name: string, value: string): void {
    this.lastUpdatedSignal.set({
      name,
      timestamp: Date.now(),
      value
    });
  }

  private fireConfetti(): void {
    if (typeof window === 'undefined') return;
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if unavailable
    }
  }
}
