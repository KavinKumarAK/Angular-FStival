export type CharacterClassId = 'warrior' | 'mage' | 'rogue' | 'paladin';
export type ElementType = 'flame' | 'frost' | 'lightning' | 'void';
export type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

export interface CharacterClass {
  id: CharacterClassId;
  name: string;
  tagline: string;
  primaryStat: 'strength' | 'agility' | 'magic';
  icon: string;
  badgeColor: string;
}

export interface HatItem {
  id: string;
  name: string;
  type: 'helm' | 'wizard' | 'visor' | 'crown' | 'hood';
  description: string;
  rarity: RarityType;
  strengthBonus: number;
  agilityBonus: number;
  magicBonus: number;
}

export interface OutfitItem {
  id: string;
  name: string;
  type: 'plate' | 'robe' | 'cyber' | 'leather';
  description: string;
  rarity: RarityType;
  baseColor: string;
  trimColor: string;
  defense: number;
}

export interface WeaponItem {
  id: string;
  name: string;
  type: 'sword' | 'staff' | 'bow' | 'scythe' | 'daggers' | 'wand';
  description: string;
  baseDamage: number;
  scalingStat: 'strength' | 'agility' | 'magic';
  element: ElementType;
  rarity: RarityType;
  iconSymbol: string;
  accentColor: string;
}

export interface SpecialPower {
  id: string;
  name: string;
  element: ElementType;
  description: string;
  powerMultiplier: number;
  glowColor: string;
  secondaryGlow: string;
}

export interface RpgStats {
  strength: number;
  agility: number;
  magic: number;
}

export interface CharacterPreset {
  name: string;
  characterClass: CharacterClassId;
  skinColor: string;
  hatId: string;
  outfitId: string;
  weaponId: string;
  powerActive: boolean;
  powerId: string;
  stats: RpgStats;
}

export const CLASSES: CharacterClass[] = [
  {
    id: 'warrior',
    name: 'Dragon Warrior',
    tagline: 'Brutal melee mastery & iron defense',
    primaryStat: 'strength',
    icon: '⚔️',
    badgeColor: '#ef4444'
  },
  {
    id: 'mage',
    name: 'Arcane Mage',
    tagline: 'Unleashes destructive elemental spells',
    primaryStat: 'magic',
    icon: '🔮',
    badgeColor: '#8b5cf6'
  },
  {
    id: 'rogue',
    name: 'Shadow Rogue',
    tagline: 'Lightning reflexes & precision criticals',
    primaryStat: 'agility',
    icon: '🗡️',
    badgeColor: '#10b981'
  },
  {
    id: 'paladin',
    name: 'Cyber Paladin',
    tagline: 'Holy shields & futuristic cyber-sorcery',
    primaryStat: 'strength',
    icon: '🛡️',
    badgeColor: '#f59e0b'
  }
];

export const HATS: HatItem[] = [
  {
    id: 'horned-helm',
    name: 'Viking War Helm',
    type: 'helm',
    description: 'Forged with dragon-iron horns for brutal headbutts.',
    rarity: 'rare',
    strengthBonus: 4,
    agilityBonus: 0,
    magicBonus: 0
  },
  {
    id: 'wizard-hat',
    name: 'Starseeker Wizard Hat',
    type: 'wizard',
    description: 'Embroidered with celestial starlight for spell weaving.',
    rarity: 'epic',
    strengthBonus: 0,
    agilityBonus: 1,
    magicBonus: 6
  },
  {
    id: 'cyber-visor',
    name: 'Neon Cyber Visor',
    type: 'visor',
    description: 'HUD tracking calculates enemy weak points at 240 FPS.',
    rarity: 'legendary',
    strengthBonus: 2,
    agilityBonus: 5,
    magicBonus: 2
  },
  {
    id: 'hero-crown',
    name: 'Crown of Radiance',
    type: 'crown',
    description: 'Worn by rulers whose aura commands the battlefield.',
    rarity: 'legendary',
    strengthBonus: 3,
    agilityBonus: 3,
    magicBonus: 4
  },
  {
    id: 'shadow-cowl',
    name: 'Shinobi Hood',
    type: 'hood',
    description: 'Woven from moonlit shadow silk. Silent in footsteps.',
    rarity: 'rare',
    strengthBonus: 1,
    agilityBonus: 5,
    magicBonus: 1
  }
];

export const OUTFITS: OutfitItem[] = [
  {
    id: 'plate-armor',
    name: 'Paladin Heavy Plate',
    type: 'plate',
    description: 'Reinforced steel with gold inlays to deflect dragon breath.',
    rarity: 'epic',
    baseColor: '#334155',
    trimColor: '#eab308',
    defense: 45
  },
  {
    id: 'archmage-robe',
    name: 'Archmage Velvet Robe',
    type: 'robe',
    description: 'Enchanted fabric that absorbs and redirects arcane mana.',
    rarity: 'rare',
    baseColor: '#4c1d95',
    trimColor: '#a855f7',
    defense: 20
  },
  {
    id: 'cyber-exosuit',
    name: 'Hyperdrive Cyber Suit',
    type: 'cyber',
    description: 'Carbon fiber weaves with pulse-conduit cooling channels.',
    rarity: 'legendary',
    baseColor: '#0f172a',
    trimColor: '#06b6d4',
    defense: 38
  },
  {
    id: 'rogue-tunic',
    name: 'Midnight Assassin Leathers',
    type: 'leather',
    description: 'Aerodynamic treated leather granting silent mobility.',
    rarity: 'rare',
    baseColor: '#1c1917',
    trimColor: '#10b981',
    defense: 28
  }
];

export const WEAPONS: WeaponItem[] = [
  {
    id: 'flame-sword',
    name: 'Infernal Sunblade',
    type: 'sword',
    description: 'Ignites the air with solar flames upon every swing.',
    baseDamage: 45,
    scalingStat: 'strength',
    element: 'flame',
    rarity: 'epic',
    iconSymbol: '🔥🗡️',
    accentColor: '#f97316'
  },
  {
    id: 'frost-staff',
    name: 'Glacial Scepter',
    type: 'staff',
    description: 'Channels blizzards capable of freezing lava solid.',
    baseDamage: 42,
    scalingStat: 'magic',
    element: 'frost',
    rarity: 'epic',
    iconSymbol: '❄️🪄',
    accentColor: '#38bdf8'
  },
  {
    id: 'lightning-bow',
    name: 'Thunderbolt Recurve',
    type: 'bow',
    description: 'Fires supersonic lightning arrows that split in mid-air.',
    baseDamage: 40,
    scalingStat: 'agility',
    element: 'lightning',
    rarity: 'legendary',
    iconSymbol: '⚡🏹',
    accentColor: '#eab308'
  },
  {
    id: 'void-scythe',
    name: 'Void Eclipse Scythe',
    type: 'scythe',
    description: 'Cleaves the dimensional fabric with dark gravity pulses.',
    baseDamage: 52,
    scalingStat: 'strength',
    element: 'void',
    rarity: 'legendary',
    iconSymbol: '🌌⛏️',
    accentColor: '#a855f7'
  },
  {
    id: 'venom-daggers',
    name: 'Emerald Twin Daggers',
    type: 'daggers',
    description: 'Coated in viper venom; strikes thrice before blinking.',
    baseDamage: 38,
    scalingStat: 'agility',
    element: 'frost',
    rarity: 'rare',
    iconSymbol: '🐍🗡️',
    accentColor: '#10b981'
  },
  {
    id: 'cosmic-wand',
    name: 'Supernova Prism Wand',
    type: 'wand',
    description: 'Funnels pure starlight into piercing gamma bursts.',
    baseDamage: 46,
    scalingStat: 'magic',
    element: 'lightning',
    rarity: 'epic',
    iconSymbol: '✨🌟',
    accentColor: '#ec4899'
  }
];

export const SPECIAL_POWERS: SpecialPower[] = [
  {
    id: 'flame-aura',
    name: 'Dragonfire Radiance',
    element: 'flame',
    description: 'Surrounds the champion in blazing dragon fire (+25% power).',
    powerMultiplier: 1.25,
    glowColor: '#ff4500',
    secondaryGlow: '#ffaa00'
  },
  {
    id: 'frost-barrier',
    name: 'Absolute Zero Aura',
    element: 'frost',
    description: 'Creates a crystal ice vortex that empowers frost spells (+25% power).',
    powerMultiplier: 1.25,
    glowColor: '#00d2ff',
    secondaryGlow: '#99f6ff'
  },
  {
    id: 'lightning-surge',
    name: 'Overcharged Ion Storm',
    element: 'lightning',
    description: 'Electricity crackles around the champion, electrifying attacks (+25% power).',
    powerMultiplier: 1.25,
    glowColor: '#ffe600',
    secondaryGlow: '#fffbeb'
  },
  {
    id: 'void-vortex',
    name: 'Singularity Void Aura',
    element: 'void',
    description: 'Gravitational distortion bends light and devours enemy defenses (+30% power).',
    powerMultiplier: 1.30,
    glowColor: '#9333ea',
    secondaryGlow: '#c084fc'
  }
];

export const SKIN_PALETTES = [
  { label: 'Yellow', value: '#fbbf24' },
  { label: 'Cream', value: '#fed7aa' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Purple', value: '#a78bfa' },
  { label: 'Mint', value: '#4ade80' },
  { label: 'Light Blue', value: '#bae6fd' },
  { label: 'Slate', value: '#475569' }
];

export const PRESETS: CharacterPreset[] = [
  {
    name: 'Ignis Flareheart',
    characterClass: 'warrior',
    skinColor: '#fbbf24',
    hatId: 'horned-helm',
    outfitId: 'plate-armor',
    weaponId: 'flame-sword',
    powerActive: true,
    powerId: 'flame-aura',
    stats: { strength: 16, agility: 8, magic: 6 }
  },
  {
    name: 'Lyra Frostwhisper',
    characterClass: 'mage',
    skinColor: '#bae6fd',
    hatId: 'wizard-hat',
    outfitId: 'archmage-robe',
    weaponId: 'frost-staff',
    powerActive: true,
    powerId: 'frost-barrier',
    stats: { strength: 6, agility: 9, magic: 18 }
  },
  {
    name: 'Kaelen Ghoststride',
    characterClass: 'rogue',
    skinColor: '#fed7aa',
    hatId: 'shadow-cowl',
    outfitId: 'rogue-tunic',
    weaponId: 'lightning-bow',
    powerActive: true,
    powerId: 'lightning-surge',
    stats: { strength: 7, agility: 18, magic: 8 }
  },
  {
    name: 'V-09 Cyber Paladin',
    characterClass: 'paladin',
    skinColor: '#a78bfa',
    hatId: 'cyber-visor',
    outfitId: 'cyber-exosuit',
    weaponId: 'void-scythe',
    powerActive: true,
    powerId: 'void-vortex',
    stats: { strength: 14, agility: 11, magic: 12 }
  }
];
