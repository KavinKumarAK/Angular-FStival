import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CharacterCanvasComponent } from './components/character-canvas/character-canvas.component';
import { CustomizerPanelComponent } from './components/customizer-panel/customizer-panel.component';
import { CodePeekerComponent } from './components/code-peeker/code-peeker.component';
import { CharacterStateService } from './services/character-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CharacterCanvasComponent,
    CustomizerPanelComponent,
    CodePeekerComponent
  ],
  template: `
    <div class="app-viewport" [class.presenter-mode]="state.presenterMode()">
      <!-- Top Navigation & Stage Header -->
      <app-header />

      <!-- Main Stage Area: 2-Column Responsive Layout -->
      <main class="main-content">
        <!-- Left Stage: Character Sprite & Live HUD -->
        <section class="stage-column canvas-stage" aria-label="Character Canvas">
          <app-character-canvas />
        </section>

        <!-- Right Stage: Interactive Customization Controls -->
        <section class="stage-column customizer-stage" aria-label="Customization Panel">
          <app-customizer-panel />
        </section>
      </main>

      <!-- Educational Concept Strip for Tech Festival Demo -->
      <footer class="concept-strip">
        <div class="concept-card" (click)="openConcept('signals')">
          <span class="concept-pill pill-signal">⚡ SIGNALS</span>
          <span class="concept-note">Fine-grained reactive state without Zone overhead</span>
        </div>

        <div class="concept-card" (click)="openConcept('bindings')">
          <span class="concept-pill pill-twoway">🍌 [(ngModel)]</span>
          <span class="concept-note">Instant two-way binding on Hero Name</span>
        </div>

        <div class="concept-card" (click)="openConcept('directives')">
          <span class="concept-pill pill-directive">🔀 &#64;if / &#64;for</span>
          <span class="concept-note">Native template control flow with tracking</span>
        </div>

        <div class="concept-card" (click)="openConcept('signals')">
          <span class="concept-pill pill-computed">🧮 computed()</span>
          <span class="concept-note">Derived attack calculations update in real-time</span>
        </div>
      </footer>

      <!-- Live Code Peeker Drawer & Floating Trigger -->
      <app-code-peeker />
    </div>
  `,
  styles: [`
    .app-viewport {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .main-content {
      flex: 1;
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 1.5rem;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      padding: 1.25rem 1.5rem;
      align-items: start;
    }

    .stage-column {
      width: 100%;
    }

    /* Concept Strip */
    .concept-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      max-width: 1440px;
      margin: 0 auto 1.25rem auto;
      width: 100%;
      padding: 0 1.5rem;
    }

    .concept-card {
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 0.65rem 0.95rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .concept-card:hover {
      background: #1F2433;
      border-color: #00D2FF;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);
    }

    .concept-pill {
      align-self: flex-start;
      font-weight: 700;
    }

    .concept-note {
      font-size: 0.72rem;
      color: #94A3B8;
      line-height: 1.3;
    }

    /* Responsive adjustments */
    @media (max-width: 1080px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      .concept-strip {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .main-content {
        padding: 0.75rem;
      }
      .concept-strip {
        grid-template-columns: 1fr;
        padding: 0 0.75rem;
      }
    }
  `]
})
export class AppComponent {
  state = inject(CharacterStateService);

  openConcept(tab: 'signals' | 'bindings' | 'directives' | 'state'): void {
    this.state.openCodePeekerWithTab(tab);
  }
}
