import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterStateService } from '../../services/character-state.service';
import {
  CLASSES,
  HATS,
  OUTFITS,
  WEAPONS,
  SPECIAL_POWERS,
  SKIN_PALETTES,
  CharacterClass,
  HatItem,
  OutfitItem,
  WeaponItem,
  SpecialPower,
  RpgStats
} from '../../models/character.model';

@Component({
  selector: 'app-customizer-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="customizer-container card-glass">
      <!-- Section 1 - Hero Identity -->
      <div class="panel-section">
        <div class="section-title-row">
          <div class="title-group">
            <h3 class="section-title">SECTION 1 - HERO IDENTITY</h3>
            <span class="pill-twoway cursor-pointer" (click)="openBindingsTab()">
              Two-Way: [(ngModel)]
            </span>
          </div>
          <span class="section-subtext">Two-way reactive data stream</span>
        </div>

        <div class="name-input-container">
          <div class="input-field-wrap">
            <input
              type="text"
              class="hero-name-input"
              [ngModel]="state.characterName()"
              (ngModelChange)="onNameChange($event)"
              placeholder="Enter Hero Name..."
              maxlength="24"
            />
            <span class="input-binding-pill">&#91;(ngModel)&#93;="characterName"</span>
          </div>
        </div>
      </div>

      <!-- Section 2 - Class & Palette -->
      <div class="panel-section">
        <div class="section-title-row">
          <div class="title-group">
            <h3 class="section-title">SECTION 2 - CLASS & PALETTE</h3>
            <span class="pill-signal cursor-pointer" (click)="openSignalsTab()">
              Signal: signal()
            </span>
          </div>
        </div>

        <!-- Class Grid (Dragon Warrior, Arcane Mage, Shadow Rogue, Cyber Paladin) -->
        <div class="class-grid">
          @for (cls of classes; track cls.id) {
            <button
              class="class-option-card card-glass-interactive"
              [class.card-active]="state.selectedClass().id === cls.id"
              (click)="state.setClass(cls)"
            >
              <div class="class-card-top">
                <span class="class-icon">{{ cls.icon }}</span>
                <span class="class-primary-tag">{{ cls.primaryStat.toUpperCase() }}</span>
              </div>
              <div class="class-label-wrap">
                <span class="class-label-name">{{ cls.name }}</span>
                <span class="class-label-sub">({{ cls.primaryStat === 'strength' ? 'Strength' : cls.primaryStat === 'magic' ? 'Magic' : 'Agility' }})</span>
              </div>
            </button>
          }
        </div>

        <!-- Skin Tone Selector: Interactive Color Swatches -->
        <div class="skin-tone-container">
          <span class="tone-label">Skin Tone Selector:</span>
          <div class="swatches-wrap">
            @for (swatch of skinPalettes; track swatch.label) {
              <button
                class="tone-swatch"
                [style.backgroundColor]="swatch.value"
                [class.swatch-selected]="state.skinColor() === swatch.value"
                (click)="state.setSkinColor(swatch.value)"
                [title]="swatch.label"
              ></button>
            }
            <!-- Color Picker Input -->
            <label class="native-picker-btn" title="Custom Hex Color">
              <input
                type="color"
                class="hidden-color-input"
                [value]="state.skinColor()"
                (input)="onColorInput($event)"
              />
              <span class="picker-icon">🎨</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 3 - Gear & Armor -->
      <div class="panel-section">
        <div class="section-title-row">
          <div class="title-group">
            <h3 class="section-title">SECTION 3 - GEAR & ARMOR</h3>
            <span class="pill-directive cursor-pointer" (click)="openDirectivesTab()">
              Control Flow: &#64;for
            </span>
          </div>
        </div>

        <!-- Headgear / Helm Options: Selectable Tag Chips with Rarity Badges -->
        <div class="gear-option-block">
          <label class="gear-block-label">HEADGEAR / HELM OPTIONS:</label>
          <div class="headgear-chips-grid">
            @for (hat of displayedHats; track hat.id) {
              <button
                class="hat-chip-btn"
                [class.chip-selected]="state.selectedHat().id === hat.id"
                (click)="state.setHat(hat)"
              >
                <span class="chip-hat-name">{{ hat.name }}</span>
                <span class="rarity-badge" [class]="'badge-' + hat.rarity">
                  {{ hat.rarity }}
                </span>
              </button>
            }
          </div>
        </div>

        <!-- Body Outfit Options: Radio Pill Buttons -->
        <div class="gear-option-block mt-3">
          <label class="gear-block-label">BODY OUTFIT OPTIONS:</label>
          <div class="outfit-radio-pills">
            @for (outfit of displayedOutfits; track outfit.id) {
              <button
                class="radio-pill-btn"
                [class.pill-selected]="state.selectedOutfit().id === outfit.id"
                (click)="state.setOutfit(outfit)"
              >
                <span class="radio-indicator"></span>
                <span class="outfit-pill-name">{{ outfit.name }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Section 4 - Weapon Arsenal (@for Showcase) -->
      <div class="panel-section">
        <div class="section-title-row">
          <div class="title-group">
            <h3 class="section-title">SECTION 4 - WEAPON ARSENAL</h3>
            <span class="pill-directive cursor-pointer" (click)="openDirectivesTab()">
              &#64;for (w of weapons; track w.id)
            </span>
          </div>
        </div>

        <div class="weapons-grid">
          @for (weapon of weapons; track weapon.id) {
            <button
              class="weapon-card card-glass-interactive"
              [class.card-active]="state.selectedWeapon().id === weapon.id"
              (click)="state.setWeapon(weapon)"
            >
              <div class="weapon-top-row">
                <span class="weapon-sym">{{ weapon.iconSymbol }}</span>
                <span class="weapon-dmg">{{ weapon.baseDamage }} DMG</span>
              </div>
              <div class="weapon-title">{{ weapon.name }}</div>
              <div class="weapon-bottom-tags">
                <span class="scaling-tag">Scales: {{ weapon.scalingStat.toUpperCase() }}</span>
                <span class="element-tag" [class]="'elem-' + weapon.element">
                  {{ weapon.element }}
                </span>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Section 5 - Special Power & Stat Allocation (computed demo) -->
      <div class="panel-section">
        <div class="section-title-row">
          <div class="title-group">
            <h3 class="section-title">SECTION 5 - SPECIAL POWER & STATS</h3>
            <span class="pill-computed cursor-pointer" (click)="openSignalsTab()">
              computed(() => ...)
            </span>
          </div>
        </div>

        <!-- Power Toggle Switch -->
        <div class="power-toggle-strip">
          <div class="power-text-wrap">
            <span class="power-heading">Unleash Elemental Aura (&#64;if)</span>
            <span class="power-subheading">Mounts animated SVG particles &amp; +25% combat power</span>
          </div>
          <button
            class="switch-control"
            [class.switch-active]="state.powerActive()"
            (click)="state.togglePower()"
          >
            <span class="switch-ball"></span>
          </button>
        </div>

        <!-- Stat Allocator -->
        <div class="stat-pool-header">
          <span class="stat-pool-title">RPG STAT POINTS:</span>
          <span class="pool-points-badge">Points Left: <strong>{{ state.availableStatPoints() }}</strong></span>
        </div>

        <div class="stats-stepper-list">
          <div class="stepper-row">
            <span class="stat-lbl text-flame">⚔️ STRENGTH</span>
            <div class="stepper-btns">
              <button class="step-btn" (click)="state.decreaseStat('strength')" [disabled]="state.stats().strength <= 2">-</button>
              <span class="step-val">{{ state.stats().strength }}</span>
              <button class="step-btn" (click)="state.increaseStat('strength')" [disabled]="state.availableStatPoints() <= 0">+</button>
            </div>
          </div>

          <div class="stepper-row">
            <span class="stat-lbl text-emerald">🏹 AGILITY</span>
            <div class="stepper-btns">
              <button class="step-btn" (click)="state.decreaseStat('agility')" [disabled]="state.stats().agility <= 2">-</button>
              <span class="step-val">{{ state.stats().agility }}</span>
              <button class="step-btn" (click)="state.increaseStat('agility')" [disabled]="state.availableStatPoints() <= 0">+</button>
            </div>
          </div>

          <div class="stepper-row">
            <span class="stat-lbl text-purple">🔮 MAGIC</span>
            <div class="stepper-btns">
              <button class="step-btn" (click)="state.decreaseStat('magic')" [disabled]="state.stats().magic <= 2">-</button>
              <span class="step-val">{{ state.stats().magic }}</span>
              <button class="step-btn" (click)="state.increaseStat('magic')" [disabled]="state.availableStatPoints() <= 0">+</button>
            </div>
          </div>
        </div>

        <!-- Formula Card -->
        <div class="formula-box">
          <div class="formula-header-title">
            <span>🔬 HOW computed() RECALCULATES TOTAL POWER:</span>
          </div>
          <pre class="formula-pre"><code>{{ getFormulaText() }}</code></pre>
          <div class="formula-actions">
            <button class="reset-btn" (click)="state.resetStats()">Reset Points</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customizer-container {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      padding: 1.35rem;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.85rem;
      max-height: 86vh;
      overflow-y: auto;
    }

    .panel-section {
      background: #0B0E14;
      border: 1px solid var(--border-subtle);
      border-radius: 0.65rem;
      padding: 1rem;
    }

    .section-title-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title {
      font-family: var(--font-rpg);
      font-size: 0.88rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.06em;
      margin: 0;
    }

    .section-subtext {
      font-size: 0.7rem;
      color: #64748B;
      font-family: var(--font-code);
    }

    .cursor-pointer {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .cursor-pointer:hover {
      transform: scale(1.05);
    }

    /* Section 1: Hero Name Input */
    .hero-name-input {
      width: 100%;
      background: #161923;
      border: 2px solid rgba(255, 230, 0, 0.4);
      border-radius: 0.45rem;
      padding: 0.65rem 0.95rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: #FFFFFF;
      font-family: var(--font-ui);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .hero-name-input:focus {
      border-color: #FFE600;
      box-shadow: 0 0 16px rgba(255, 230, 0, 0.35);
    }

    .input-field-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .input-binding-pill {
      align-self: flex-end;
      font-family: var(--font-code);
      font-size: 0.68rem;
      color: #FFE600;
      background: rgba(255, 230, 0, 0.1);
      padding: 0.15rem 0.45rem;
      border-radius: 0.25rem;
    }

    /* Section 2: Class Grid */
    .class-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }

    .class-option-card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.65rem 0.85rem;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      text-align: left;
    }

    .class-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .class-icon {
      font-size: 1.25rem;
    }

    .class-primary-tag {
      font-family: var(--font-code);
      font-size: 0.62rem;
      font-weight: 800;
      color: #00D2FF;
      background: rgba(0, 210, 255, 0.1);
      padding: 0.1rem 0.35rem;
      border-radius: 0.25rem;
    }

    .class-label-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #FFFFFF;
      display: block;
    }

    .class-label-sub {
      font-size: 0.68rem;
      color: #94A3B8;
      display: block;
    }

    /* Skin Tone Swatches */
    .skin-tone-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #161923;
      padding: 0.6rem 0.85rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-subtle);
    }

    .tone-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94A3B8;
    }

    .swatches-wrap {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: wrap;
    }

    .tone-swatch {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s;
    }

    .tone-swatch:hover {
      transform: scale(1.2);
      border-color: #FFFFFF;
    }

    .swatch-selected {
      transform: scale(1.25);
      border-color: #00D2FF !important;
      box-shadow: 0 0 10px rgba(0, 210, 255, 0.8);
    }

    .native-picker-btn {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #232738;
      border-radius: 50%;
    }

    .hidden-color-input {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .picker-icon {
      font-size: 0.8rem;
    }

    /* Section 3: Gear & Armor */
    .gear-option-block {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .gear-block-label {
      font-family: var(--font-code);
      font-size: 0.68rem;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.05em;
    }

    .headgear-chips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.45rem;
    }

    .hat-chip-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0.65rem;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .hat-chip-btn:hover {
      border-color: #00D2FF;
      background: #1F2433;
    }

    .chip-selected {
      background: rgba(0, 210, 255, 0.12) !important;
      border-color: #00D2FF !important;
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.3);
    }

    .chip-hat-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: #E2E8F0;
    }

    .rarity-badge {
      font-family: var(--font-code);
      font-size: 0.62rem;
      font-weight: 700;
      padding: 0.1rem 0.35rem;
      border-radius: 0.25rem;
      text-transform: lowercase;
    }

    .badge-rare {
      color: #00D2FF;
      background: rgba(0, 210, 255, 0.1);
      border: 1px solid rgba(0, 210, 255, 0.3);
    }

    .badge-epic {
      color: #C084FC;
      background: rgba(192, 132, 252, 0.1);
      border: 1px solid rgba(192, 132, 252, 0.3);
    }

    .badge-legendary {
      color: #FFE600;
      background: rgba(255, 230, 0, 0.1);
      border: 1px solid rgba(255, 230, 0, 0.4);
    }

    /* Radio Pill Buttons for Outfits */
    .outfit-radio-pills {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .radio-pill-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.85rem;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .radio-pill-btn:hover {
      border-color: #00D2FF;
      background: #1F2433;
    }

    .pill-selected {
      background: rgba(0, 210, 255, 0.1) !important;
      border-color: #00D2FF !important;
      box-shadow: 0 0 10px rgba(0, 210, 255, 0.25);
    }

    .radio-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #64748B;
      display: inline-block;
      transition: all 0.2s;
    }

    .pill-selected .radio-indicator {
      border-color: #00D2FF;
      background: #00D2FF;
      box-shadow: 0 0 6px #00D2FF;
    }

    .outfit-pill-name {
      font-size: 0.78rem;
      font-weight: 600;
      color: #E2E8F0;
    }

    /* Section 4: Weapons Grid */
    .weapons-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .weapon-card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.65rem;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      text-align: left;
    }

    .weapon-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .weapon-sym {
      font-size: 1.1rem;
    }

    .weapon-dmg {
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 700;
      color: #F87171;
    }

    .weapon-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .weapon-bottom-tags {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      font-family: var(--font-code);
    }

    .scaling-tag {
      color: #94A3B8;
    }

    .elem-flame { color: #FF5E00; }
    .elem-frost { color: #00D2FF; }
    .elem-lightning { color: #FFE600; }
    .elem-void { color: #C084FC; }

    /* Section 5: Power & Stats */
    .power-toggle-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #161923;
      padding: 0.65rem 0.85rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-subtle);
      margin-bottom: 0.85rem;
    }

    .power-heading {
      font-size: 0.8rem;
      font-weight: 700;
      color: #FFFFFF;
      display: block;
    }

    .power-subheading {
      font-size: 0.68rem;
      color: #94A3B8;
      display: block;
    }

    .switch-control {
      width: 46px;
      height: 24px;
      background: #232738;
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 9999px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.25s;
      flex-shrink: 0;
    }

    .switch-ball {
      width: 16px;
      height: 16px;
      background: #94A3B8;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 4px;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s;
    }

    .switch-active {
      background: #00D2FF;
      border-color: #00D2FF;
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.6);
    }

    .switch-active .switch-ball {
      transform: translateX(22px);
      background: #0B0E14;
    }

    .stat-pool-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .stat-pool-title {
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748B;
    }

    .pool-points-badge {
      font-family: var(--font-code);
      font-size: 0.72rem;
      color: #00D2FF;
    }

    .stats-stepper-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }

    .stepper-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #161923;
      padding: 0.5rem 0.75rem;
      border-radius: 0.45rem;
      border: 1px solid var(--border-subtle);
    }

    .stat-lbl {
      font-family: var(--font-code);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .text-flame { color: #FF5E00; }
    .text-emerald { color: #10B981; }
    .text-purple { color: #C084FC; }

    .stepper-btns {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .step-btn {
      width: 26px;
      height: 26px;
      border-radius: 0.35rem;
      background: #232738;
      border: 1px solid var(--border-subtle);
      color: #FFFFFF;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .step-btn:hover:not(:disabled) {
      background: #00D2FF;
      color: #0B0E14;
    }

    .step-btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    .step-val {
      font-family: var(--font-code);
      font-size: 1rem;
      font-weight: 800;
      color: #FFFFFF;
      min-width: 24px;
      text-align: center;
    }

    .formula-box {
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 0.75rem;
    }

    .formula-header-title {
      font-family: var(--font-code);
      font-size: 0.68rem;
      font-weight: 700;
      color: #C084FC;
      margin-bottom: 0.35rem;
    }

    .formula-pre {
      font-family: var(--font-code);
      font-size: 0.72rem;
      color: #CBD5E1;
      line-height: 1.45;
      margin: 0;
      white-space: pre-wrap;
    }

    .formula-actions {
      margin-top: 0.5rem;
      display: flex;
      justify-content: flex-end;
    }

    .reset-btn {
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: #94A3B8;
      padding: 0.2rem 0.55rem;
      border-radius: 0.35rem;
      font-size: 0.68rem;
      font-family: var(--font-code);
      cursor: pointer;
      transition: all 0.2s;
    }

    .reset-btn:hover {
      border-color: #EF4444;
      color: #F87171;
    }

    .mt-3 {
      margin-top: 0.75rem;
    }
  `]
})
export class CustomizerPanelComponent {
  state = inject(CharacterStateService);

  classes = CLASSES;
  // Specific 4 hats requested by user:
  // Viking War Helm - rare, Starseeker Wizard Hat - epic, Neon Cyber Visor - legendary, Crown of Radiance - legendary
  displayedHats = HATS.filter(h => ['horned-helm', 'wizard-hat', 'cyber-visor', 'hero-crown'].includes(h.id));
  
  // Specific 3 outfits requested by user:
  // Paladin Heavy Plate, Archmage Velvet Robe, Hyperdrive Cyber Suit
  displayedOutfits = OUTFITS.filter(o => ['plate-armor', 'archmage-robe', 'cyber-exosuit'].includes(o.id));

  weapons = WEAPONS;
  specialPowers = SPECIAL_POWERS;
  skinPalettes = SKIN_PALETTES;

  onNameChange(val: string): void {
    this.state.setName(val);
  }

  onColorInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input) {
      this.state.setSkinColor(input.value);
    }
  }

  getScalingBonusText(): string {
    const w = this.state.selectedWeapon();
    const st = this.state.stats();
    if (w.scalingStat === 'strength') return `STR(${st.strength}) * 2.4 = ${(st.strength * 2.4).toFixed(0)}`;
    if (w.scalingStat === 'agility') return `AGI(${st.agility}) * 2.5 = ${(st.agility * 2.5).toFixed(0)}`;
    return `MAG(${st.magic}) * 2.6 = ${(st.magic * 2.6).toFixed(0)}`;
  }

  getFormulaText(): string {
    const w = this.state.selectedWeapon();
    const isSynergy = this.state.powerActive() && this.state.selectedPower().element === w.element;
    const mult = this.state.powerActive() ? this.state.selectedPower().powerMultiplier : 1.0;
    return `totalAttackPower = computed(() => {
  const base = weapon.baseDamage (${w.baseDamage});
  const statBonus = ${this.getScalingBonusText()};
  const synergy = ${isSynergy ? '+18 (Element Resonance)' : '+0'};
  const multiplier = ${mult}x;
  return Math.round((base + statBonus + synergy) * multiplier);
  // => RESULT: ${this.state.totalAttackPower()} ATK
});`;
  }

  openSignalsTab(): void {
    this.state.openCodePeekerWithTab('signals');
  }

  openBindingsTab(): void {
    this.state.openCodePeekerWithTab('bindings');
  }

  openDirectivesTab(): void {
    this.state.openCodePeekerWithTab('directives');
  }
}
