import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterStateService } from '../../services/character-state.service';
import { PRESETS, CharacterPreset } from '../../models/character.model';
import { SoundEffectsService } from '../../services/sound-effects.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-container">
      <!-- App Logo & Badge -->
      <div class="brand-section">
        <div class="logo-badge">
          <span class="logo-icon">⚡</span>
        </div>
        <div class="brand-text-col">
          <div class="title-row">
            <h1 class="brand-title">HERO FORGE</h1>
            <span class="signals-badge">ANGULAR 18+ SIGNALS</span>
          </div>
          <p class="brand-subtitle">
            2D Character Customizer & Reactive State Inspector
          </p>
        </div>
      </div>

      <!-- Quick Presets Segmented Bar -->
      <div class="presets-section">
        <span class="presets-label">PRESETS:</span>
        <div class="segmented-bar">
          @for (preset of presets; track preset.name) {
            <button
              class="segmented-btn"
              [class.segmented-active]="state.characterName() === preset.name"
              (click)="onSelectPreset(preset)"
              [title]="'Load profile: ' + preset.name"
            >
              <span class="preset-name">{{ preset.name.split(' ')[0] }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Header Utility Controls -->
      <div class="controls-section">
        <!-- Audio Synthesizer Toggle -->
        <button
          class="audio-btn"
          (click)="toggleSound()"
          [title]="sound.isEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'"
          aria-label="Toggle Audio"
        >
          <span class="audio-icon">{{ sound.isEnabled ? '🔊' : '🔇' }}</span>
        </button>

        <!-- Presenter Mode Toggle Switch: ON/OFF -->
        <div 
          class="presenter-switch-box"
          (click)="state.togglePresenterMode()"
          title="Toggle High Contrast & Enlarged Text for Auditorium Screen Projection"
        >
          <span class="presenter-label">Presenter Mode:</span>
          <span class="presenter-state-badge" [class.state-on]="state.presenterMode()">
            {{ state.presenterMode() ? 'ON' : 'OFF' }}
          </span>
        </div>

        <!-- Primary CTA: See Angular Code -->
        <button
          class="cta-see-code-btn"
          (click)="state.toggleCodePeeker()"
        >
          <span class="cta-code-icon">👀</span>
          <span class="cta-code-text">See Angular Code</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1.75rem;
      background: #161923;
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 40;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .logo-badge {
      width: 42px;
      height: 42px;
      border-radius: 0.65rem;
      background: linear-gradient(135deg, #00D2FF 0%, #3B82F6 50%, #A855F7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(0, 210, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .logo-icon {
      font-size: 1.35rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    .brand-text-col {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .brand-title {
      font-family: var(--font-rpg);
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #FFFFFF;
      background: linear-gradient(90deg, #FFFFFF, #00D2FF, #C084FC);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .signals-badge {
      font-family: var(--font-code);
      font-size: 0.65rem;
      font-weight: 800;
      color: #00D2FF;
      background: rgba(0, 210, 255, 0.1);
      border: 1px solid rgba(0, 210, 255, 0.35);
      padding: 0.18rem 0.5rem;
      border-radius: 0.25rem;
      letter-spacing: 0.06em;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: #94A3B8;
      margin: 0;
    }

    /* Segmented Bar for Presets */
    .presets-section {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #0B0E14;
      padding: 0.3rem 0.5rem;
      border-radius: 0.6rem;
      border: 1px solid var(--border-subtle);
    }

    .presets-label {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #64748B;
      font-family: var(--font-code);
      padding-left: 0.35rem;
    }

    .segmented-bar {
      display: flex;
      gap: 0.25rem;
    }

    .segmented-btn {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      background: transparent;
      color: #94A3B8;
      border: 1px solid transparent;
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .segmented-btn:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.05);
    }

    .segmented-active {
      background: #161923 !important;
      color: #00D2FF !important;
      border-color: rgba(0, 210, 255, 0.4) !important;
      box-shadow: 0 0 10px rgba(0, 210, 255, 0.25);
    }

    /* Right Controls */
    .controls-section {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .audio-btn {
      background: #0B0E14;
      border: 1px solid var(--border-subtle);
      color: #E2E8F0;
      width: 38px;
      height: 38px;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: all 0.2s;
    }

    .audio-btn:hover {
      background: #232738;
      border-color: #94A3B8;
    }

    .presenter-switch-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #0B0E14;
      border: 1px solid var(--border-subtle);
      padding: 0.35rem 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      user-select: none;
      transition: border-color 0.2s;
    }

    .presenter-switch-box:hover {
      border-color: #00D2FF;
    }

    .presenter-label {
      font-size: 0.78rem;
      color: #94A3B8;
      font-weight: 500;
    }

    .presenter-state-badge {
      font-family: var(--font-code);
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      border-radius: 0.25rem;
      background: #232738;
      color: #94A3B8;
      transition: all 0.2s;
    }

    .state-on {
      background: #FFE600 !important;
      color: #0B0E14 !important;
      box-shadow: 0 0 10px rgba(255, 230, 0, 0.5);
    }

    .cta-see-code-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.1rem;
      background: linear-gradient(135deg, #00D2FF, #0284C7);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: #0B0E14;
      font-size: 0.82rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 0 16px rgba(0, 210, 255, 0.4);
    }

    .cta-see-code-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 24px rgba(0, 210, 255, 0.65);
      background: linear-gradient(135deg, #38BDF8, #00D2FF);
    }

    .cta-code-icon {
      font-size: 1rem;
    }

    @media (max-width: 960px) {
      .presets-section {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  state = inject(CharacterStateService);
  sound = inject(SoundEffectsService);
  presets = PRESETS;

  onSelectPreset(preset: CharacterPreset): void {
    this.state.loadPreset(preset);
  }

  toggleSound(): void {
    this.sound.toggleSound();
  }
}
