import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterStateService } from '../../services/character-state.service';

@Component({
  selector: 'app-code-peeker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating Action Trigger (Bottom Right) -->
    <button 
      class="floating-peeker-trigger"
      (click)="state.toggleCodePeeker()"
      [class.peeker-open-btn]="state.codePeekerOpen()"
      title="Toggle Live Angular Code Peeker"
    >
      <span class="pulse-ring"></span>
      <span class="trigger-icon">👀</span>
      <span class="trigger-label">See How Angular Does This!</span>
    </button>

    <!-- Slide-Over Drawer Backdrop -->
    @if (state.codePeekerOpen()) {
      <div class="drawer-backdrop" (click)="state.toggleCodePeeker()"></div>
    }

    <!-- Slide-Over Drawer Container -->
    <aside 
      class="drawer-panel"
      [class.drawer-active]="state.codePeekerOpen()"
      [class.presenter-large]="state.presenterMode()"
    >
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-badge">ANGULAR 18+ ARCHITECTURE</span>
          <h2 class="drawer-title">Live Code Peeker</h2>
        </div>

        <div class="drawer-actions">
          <!-- Font Size Zoom Controls -->
          <div class="font-zoom-group" title="Adjust code font size for projector">
            <button class="zoom-btn" (click)="adjustFontSize(-1)">A-</button>
            <button class="zoom-btn" (click)="adjustFontSize(1)">A+</button>
          </div>

          <!-- Close Drawer Button -->
          <button class="close-btn" (click)="state.toggleCodePeeker()" title="Close Drawer">
            ✕
          </button>
        </div>
      </div>

      <!-- Reactive Signal Change Notification Pill -->
      <div class="signal-alert-banner">
        <span class="alert-pulse">⚡</span>
        <span class="alert-text">
          Live Reactive Node: <strong>{{ state.lastUpdatedSignal().name }}()</strong>
          &rarr; updated to <em class="alert-value">"{{ state.lastUpdatedSignal().value }}"</em>
        </span>
      </div>

      <!-- Navigation Tabs -->
      <nav class="peeker-tabs">
        <button
          class="peeker-tab"
          [class.tab-active]="state.activeCodeTab() === 'signals'"
          (click)="state.setCodeTab('signals')"
        >
          <span class="tab-emoji">⚡</span>
          <span>Signals & Computed</span>
        </button>

        <button
          class="peeker-tab"
          [class.tab-active]="state.activeCodeTab() === 'bindings'"
          (click)="state.setCodeTab('bindings')"
        >
          <span class="tab-emoji">🔗</span>
          <span>Data Bindings</span>
        </button>

        <button
          class="peeker-tab"
          [class.tab-active]="state.activeCodeTab() === 'directives'"
          (click)="state.setCodeTab('directives')"
        >
          <span class="tab-emoji">🔀</span>
          <span>Control Flow</span>
        </button>

        <button
          class="peeker-tab"
          [class.tab-active]="state.activeCodeTab() === 'state'"
          (click)="state.setCodeTab('state')"
        >
          <span class="tab-emoji">📊</span>
          <span>Live State Tree</span>
        </button>
      </nav>

      <!-- Tab Content 1: Signals & Computed -->
      @if (state.activeCodeTab() === 'signals') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">💡 What are Angular Signals?</h4>
            <p class="concept-desc">
              Signals are reactive state primitives introduced in Angular 16+ and fully mature in 18/19.
              Unlike standard variables, Signals notify only the exact DOM nodes that depend on them,
              eliminating heavy full-tree dirty checking!
            </p>
          </div>

          <!-- Code Snippet Card (Scrollable) -->
          <div class="code-card">
            <div class="code-card-header">
              <div class="header-left">
                <div class="window-dots">
                  <span class="w-dot dot-red"></span>
                  <span class="w-dot dot-yellow"></span>
                  <span class="w-dot dot-green"></span>
                </div>
                <span class="filename">character-state.service.ts</span>
              </div>
              <div class="header-right">
                <span class="scroll-hint-pill">↕ Scrollable Code</span>
                <button class="copy-btn" (click)="copySnippet(signalsSnippet)">
                  {{ copied() ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="getSignalsHtml()"></code></pre>
          </div>

          <div class="concept-explanation mt-4">
            <h4 class="concept-title">🧮 What is computed()?</h4>
            <p class="concept-desc">
              <code>computed()</code> defines a memoized signal derived from other signals.
              Notice how <code>totalAttackPower()</code> recalculated to
              <strong>{{ state.totalAttackPower() }}</strong> automatically when you changed weapon or stats!
            </p>
          </div>
        </div>
      }

      <!-- Tab Content 2: Data Bindings -->
      @if (state.activeCodeTab() === 'bindings') {
        <div class="tab-scroll-body">
          <!-- Banana in a box memory aid for students -->
          <div class="banana-box-card">
            <div class="banana-header">
              <span class="banana-icon">🍌</span>
              <span class="banana-title">The "Banana in a Box" Rule: [ ( ) ]</span>
            </div>
            <div class="banana-diagram">
              <div class="diagram-step">
                <span class="diagram-sym">[ &nbsp; ]</span>
                <span class="diagram-name">Square Brackets (Box)</span>
                <span class="diagram-sub">Property Binding: Component &rarr; HTML View</span>
              </div>
              <div class="diagram-divider">+</div>
              <div class="diagram-step">
                <span class="diagram-sym">( &nbsp; )</span>
                <span class="diagram-name">Parentheses (Banana)</span>
                <span class="diagram-sub">Event Binding: HTML View &rarr; Component</span>
              </div>
              <div class="diagram-divider">=</div>
              <div class="diagram-step highlight-step">
                <span class="diagram-sym">[ ( &nbsp; ) ]</span>
                <span class="diagram-name">Banana in a Box</span>
                <span class="diagram-sub">Two-Way Binding: [(ngModel)]="characterName"</span>
              </div>
            </div>
          </div>

          <!-- Code Snippet Card (Scrollable) -->
          <div class="code-card">
            <div class="code-card-header">
              <div class="header-left">
                <div class="window-dots">
                  <span class="w-dot dot-red"></span>
                  <span class="w-dot dot-yellow"></span>
                  <span class="w-dot dot-green"></span>
                </div>
                <span class="filename">bindings-showcase.component.html</span>
              </div>
              <div class="header-right">
                <span class="scroll-hint-pill">↕ Scrollable Code</span>
                <button class="copy-btn" (click)="copySnippet(bindingsSnippet)">
                  {{ copied() ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="getBindingsHtml()"></code></pre>
          </div>
        </div>
      }

      <!-- Tab Content 3: Modern Control Flow (@if and @for) -->
      @if (state.activeCodeTab() === 'directives') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">✨ Angular Modern Control Flow (&#64;if / &#64;for)</h4>
            <p class="concept-desc">
              Angular 17+ replaced legacy <code>*ngIf</code> and <code>*ngFor</code> with native template syntax.
              It uses built-in JS grammar, requires 0 imports, and mandates <code>track</code> for blazing-fast DOM reconciliation!
            </p>
          </div>

          <!-- Code Snippet Card (Scrollable) -->
          <div class="code-card">
            <div class="code-card-header">
              <div class="header-left">
                <div class="window-dots">
                  <span class="w-dot dot-red"></span>
                  <span class="w-dot dot-yellow"></span>
                  <span class="w-dot dot-green"></span>
                </div>
                <span class="filename">character-canvas.component.html</span>
              </div>
              <div class="header-right">
                <span class="scroll-hint-pill">↕ Scrollable Code</span>
                <button class="copy-btn" (click)="copySnippet(controlFlowSnippet)">
                  {{ copied() ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="getControlFlowHtml()"></code></pre>
          </div>
        </div>
      }

      <!-- Tab Content 4: Live Reactive State Tree (Scrollable JSON) -->
      @if (state.activeCodeTab() === 'state') {
        <div class="tab-scroll-body">
          <div class="concept-explanation">
            <h4 class="concept-title">🔍 In-Memory Reactive State Tree</h4>
            <p class="concept-desc">
              Inspecting active signals and computed values in real-time as they live in memory:
            </p>
          </div>

          <!-- Live State JSON Card (Scrollable) -->
          <div class="code-card">
            <div class="code-card-header">
              <div class="header-left">
                <div class="window-dots">
                  <span class="w-dot dot-red"></span>
                  <span class="w-dot dot-yellow"></span>
                  <span class="w-dot dot-green"></span>
                </div>
                <span class="filename">live-reactive-state.json</span>
              </div>
              <div class="header-right">
                <span class="scroll-hint-pill">↕ Scrollable JSON</span>
                <button class="copy-btn" (click)="copySnippet(getStateJson())">
                  {{ copied() ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
            </div>
            <pre class="code-block" [style.fontSize.px]="codeFontSize()"><code [innerHTML]="getStateJsonHtml()"></code></pre>
          </div>
        </div>
      }

      <!-- Drawer Footer -->
      <div class="drawer-footer">
        <span class="footer-note">
          Demonstrating <strong>Angular 18+ Standalone + Signals</strong> for Judges & Students
        </span>
      </div>
    </aside>
  `,
  styles: [`
    /* Floating Action Trigger */
    .floating-peeker-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 50;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.8rem 1.4rem;
      background: linear-gradient(135deg, #00D2FF, #3B82F6);
      color: #0B0E14;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 9999px;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(0, 210, 255, 0.5), 0 0 18px rgba(0, 210, 255, 0.35);
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .floating-peeker-trigger:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 14px 30px -5px rgba(0, 210, 255, 0.7), 0 0 24px rgba(0, 210, 255, 0.5);
    }

    .peeker-open-btn {
      background: linear-gradient(135deg, #EF4444, #F97316);
      color: #FFFFFF;
      box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.5);
    }

    .pulse-ring {
      position: absolute;
      left: 10px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #0B0E14;
      box-shadow: 0 0 8px #00D2FF;
      animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes ping {
      75%, 100% {
        transform: scale(2.2);
        opacity: 0;
      }
    }

    .trigger-icon {
      font-size: 1.25rem;
    }

    /* Drawer Backdrop */
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(6px);
      z-index: 60;
    }

    /* Slide-Over Drawer */
    .drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 600px;
      max-width: 95vw;
      background: #0B0E14;
      border-left: 1px solid rgba(0, 210, 255, 0.35);
      box-shadow: -15px 0 40px rgba(0, 0, 0, 0.85);
      z-index: 70;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .drawer-active {
      transform: translateX(0);
    }

    .presenter-large {
      width: 720px;
      max-width: 98vw;
      background: #060913;
      border-left: 2px solid #38bdf8;
    }

    /* Drawer Header */
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.1rem 1.4rem;
      border-bottom: 1px solid var(--border-dim);
      background: rgba(15, 23, 42, 0.7);
    }

    .drawer-badge {
      font-family: var(--font-code);
      font-size: 0.68rem;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.08em;
    }

    .drawer-title {
      font-family: var(--font-rpg);
      font-size: 1.3rem;
      color: #ffffff;
      margin: 0;
    }

    .drawer-actions {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .font-zoom-group {
      display: flex;
      border: 1px solid var(--border-dim);
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .zoom-btn {
      background: rgba(30, 41, 59, 0.8);
      color: #cbd5e1;
      border: none;
      padding: 0.25rem 0.6rem;
      font-family: var(--font-code);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
    }

    .zoom-btn:hover {
      background: #38bdf8;
      color: #000000;
    }

    .close-btn {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--border-dim);
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 0.375rem;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #ef4444;
      color: #ffffff;
      border-color: #ef4444;
    }

    /* Signal Alert Banner */
    .signal-alert-banner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.55rem 1.25rem;
      background: linear-gradient(90deg, rgba(234, 179, 8, 0.15), rgba(249, 115, 22, 0.15));
      border-bottom: 1px solid rgba(234, 179, 8, 0.25);
      font-size: 0.8rem;
    }

    .alert-pulse {
      color: #fbbf24;
      font-size: 1rem;
      animation: bounce 1.5s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    .alert-text {
      color: #cbd5e1;
      font-family: var(--font-code);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-value {
      color: #38bdf8;
      font-style: normal;
      font-weight: 700;
    }

    /* Tabs */
    .peeker-tabs {
      display: flex;
      background: rgba(15, 23, 42, 0.5);
      border-bottom: 1px solid var(--border-dim);
      overflow-x: auto;
    }

    .peeker-tab {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #94a3b8;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .peeker-tab:hover {
      color: #f1f5f9;
      background: rgba(30, 41, 59, 0.4);
    }

    .tab-active {
      color: #38bdf8 !important;
      border-bottom-color: #38bdf8 !important;
      background: rgba(56, 189, 248, 0.08) !important;
    }

    /* Scrollable Tab Body */
    .tab-scroll-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .concept-explanation {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 0.5rem;
      padding: 0.85rem;
    }

    .concept-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.35rem;
    }

    .concept-desc {
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.5;
    }

    .concept-desc code {
      font-family: var(--font-code);
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      padding: 0.1rem 0.3rem;
      border-radius: 0.25rem;
    }

    /* Code Card (Scrollable IDE Window) */
    .code-card {
      background: #060913;
      border: 1px solid rgba(0, 210, 255, 0.25);
      border-radius: 0.65rem;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55);
      display: flex;
      flex-direction: column;
    }

    .code-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.85rem;
      background: #111726;
      border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      position: sticky;
      top: 0;
      z-index: 5;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .window-dots {
      display: flex;
      gap: 0.35rem;
    }

    .w-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .dot-red { background: #EF4444; }
    .dot-yellow { background: #EAB308; }
    .dot-green { background: #22C55E; }

    .filename {
      font-family: var(--font-code);
      font-size: 0.72rem;
      color: #94A3B8;
      font-weight: 600;
    }

    .scroll-hint-pill {
      font-family: var(--font-code);
      font-size: 0.65rem;
      color: #00D2FF;
      background: rgba(0, 210, 255, 0.12);
      border: 1px solid rgba(0, 210, 255, 0.3);
      padding: 0.12rem 0.45rem;
      border-radius: 0.25rem;
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    .copy-btn {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.2);
      color: #cbd5e1;
      padding: 0.2rem 0.55rem;
      border-radius: 0.25rem;
      font-size: 0.72rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: #00D2FF;
      color: #0B0E14;
      border-color: #00D2FF;
    }

    /* Scrollable Code Block Container (All 4 Tabs) */
    .code-block {
      padding: 1.1rem;
      margin: 0;
      font-family: var(--font-code);
      line-height: 1.65;
      color: #e2e8f0;
      overflow-x: auto;
      overflow-y: auto;
      max-height: 380px;
      white-space: pre;
      background: #050811;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 210, 255, 0.45) #080D1A;
    }

    .code-block::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .code-block::-webkit-scrollbar-track {
      background: #080D1A;
    }
    .code-block::-webkit-scrollbar-thumb {
      background: rgba(0, 210, 255, 0.4);
      border-radius: 4px;
    }
    .code-block::-webkit-scrollbar-thumb:hover {
      background: #00D2FF;
    }

    .presenter-large .code-block {
      max-height: 480px;
    }

    /* Banana in a Box Diagram */
    .banana-box-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
      border: 1px solid rgba(234, 179, 8, 0.35);
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .banana-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .banana-icon {
      font-size: 1.3rem;
    }

    .banana-title {
      font-family: var(--font-rpg);
      font-size: 0.95rem;
      font-weight: 700;
      color: #fde047;
    }

    .banana-diagram {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .diagram-step {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-dim);
      border-radius: 0.5rem;
      padding: 0.5rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .highlight-step {
      background: rgba(234, 179, 8, 0.15);
      border-color: #f59e0b;
    }

    .diagram-sym {
      font-family: var(--font-code);
      font-size: 1rem;
      font-weight: 800;
      color: #fbbf24;
    }

    .diagram-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: #ffffff;
    }

    .diagram-sub {
      font-family: var(--font-code);
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .diagram-divider {
      text-align: center;
      color: #64748b;
      font-weight: 800;
      font-size: 0.9rem;
    }

    /* Drawer Footer */
    .drawer-footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid var(--border-dim);
      background: rgba(15, 23, 42, 0.8);
      text-align: center;
    }

    .footer-note {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .mt-4 {
      margin-top: 1rem;
    }
  `]
})
export class CodePeekerComponent {
  state = inject(CharacterStateService);

  codeFontSize = signal<number>(14);
  copied = signal<boolean>(false);

  adjustFontSize(delta: number): void {
    this.codeFontSize.update((sz) => Math.max(12, Math.min(22, sz + delta)));
  }

  copySnippet(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  get signalsSnippet(): string {
    return `// 1. Writable Signals (State)
readonly characterName = signal<string>('${this.state.characterName()}');
readonly selectedWeapon = signal<WeaponItem>({ name: '${this.state.selectedWeapon().name}', damage: ${this.state.selectedWeapon().baseDamage} });
readonly powerActive = signal<boolean>(${this.state.powerActive()});
readonly stats = signal<RpgStats>({ strength: ${this.state.stats().strength}, agility: ${this.state.stats().agility}, magic: ${this.state.stats().magic} });

// 2. Computed Signal (Derived Reactive State)
readonly totalAttackPower = computed(() => {
  const base = this.selectedWeapon().baseDamage; // ${this.state.selectedWeapon().baseDamage}
  const statBoost = this.stats().strength * 2.4;
  const powerBoost = this.powerActive() ? 1.25 : 1.0;
  return Math.round((base + statBoost) * powerBoost); // -> ${this.state.totalAttackPower()}
});`;
  }

  get bindingsSnippet(): string {
    return `<!-- 1. Two-Way Binding [(ngModel)] (Banana-in-a-Box) -->
<input 
  type="text" 
  [(ngModel)]="characterName" 
  placeholder="Hero Name" 
/>
<!-- Current value: "${this.state.characterName()}" -->

<!-- 2. Property Binding [property] -->
<ellipse 
  cx="200" cy="140" rx="44" ry="46"
  [style.fill]="skinColor()" 
/>
<!-- Injected fill style: "${this.state.skinColor()}" -->

<!-- 3. Event Binding (event) -->
<button (click)="equipWeapon(weapon)">
  Equip {{ weapon.name }}
</button>

<!-- 4. Class Binding [class.name] -->
<div [class.aura-active]="powerActive()">
  Aura Status: ${this.state.powerActive() ? 'ACTIVE' : 'OFF'}
</div>`;
  }

  get controlFlowSnippet(): string {
    return `<!-- Control Flow 1: @if toggles DOM presence -->
@if (powerActive()) {
  <g class="elemental-aura">
    <!-- Rendered only when powerActive() is true! -->
    <circle r="145" fill="url(#${this.state.selectedPower().element}Glow)" />
  </g>
} @else {
  <span class="dormant-text">Power is Dormant</span>
}

<!-- Control Flow 2: @for loops through items with track -->
@for (w of weapons; track w.id) {
  <button 
    class="weapon-btn" 
    [class.active]="selectedWeapon().id === w.id"
    (click)="setWeapon(w)"
  >
    {{ w.iconSymbol }} {{ w.name }} ({{ w.baseDamage }} DMG)
  </button>
}`;
  }

  getSignalsHtml(): string {
    const isName = this.state.lastUpdatedSignal().name === 'characterName';
    const isWeapon = this.state.lastUpdatedSignal().name === 'selectedWeapon';
    const isPower = this.state.lastUpdatedSignal().name === 'powerActive';
    const isStats = this.state.lastUpdatedSignal().name === 'stats';

    return `<span style="color:#64748b">// 1. Writable Signals (State)</span>
<span style="color:#a855f7">readonly</span> <span style="${isName ? 'background:#fbbf2433; color:#fde047; padding:2px 4px; border-radius:4px;' : 'color:#38bdf8;'}">characterName</span> = <span style="color:#22c55e">signal</span>&lt;<span style="color:#fbbf24">string</span>&gt;(<span style="color:#a5f3fc">'${this.escape(this.state.characterName())}'</span>);
<span style="color:#a855f7">readonly</span> <span style="${isWeapon ? 'background:#fbbf2433; color:#fde047; padding:2px 4px; border-radius:4px;' : 'color:#38bdf8;'}">selectedWeapon</span> = <span style="color:#22c55e">signal</span>&lt;<span style="color:#fbbf24">Weapon</span>&gt;({ name: <span style="color:#a5f3fc">'${this.escape(this.state.selectedWeapon().name)}'</span>, baseDamage: <span style="color:#f87171">${this.state.selectedWeapon().baseDamage}</span> });
<span style="color:#a855f7">readonly</span> <span style="${isPower ? 'background:#fbbf2433; color:#fde047; padding:2px 4px; border-radius:4px;' : 'color:#38bdf8;'}">powerActive</span> = <span style="color:#22c55e">signal</span>&lt;<span style="color:#fbbf24">boolean</span>&gt;(<span style="color:#f43f5e">${this.state.powerActive()}</span>);
<span style="color:#a855f7">readonly</span> <span style="${isStats ? 'background:#fbbf2433; color:#fde047; padding:2px 4px; border-radius:4px;' : 'color:#38bdf8;'}">stats</span> = <span style="color:#22c55e">signal</span>&lt;<span style="color:#fbbf24">RpgStats</span>&gt;({ str: <span style="color:#f97316">${this.state.stats().strength}</span>, agi: <span style="color:#10b981">${this.state.stats().agility}</span>, mag: <span style="color:#c084fc">${this.state.stats().magic}</span> });

<span style="color:#64748b">// 2. Computed Signal (Auto-recalculates on dependency change)</span>
<span style="color:#a855f7">readonly</span> <span style="color:#f43f5e">totalAttackPower</span> = <span style="color:#c084fc">computed</span>(() =&gt; {
  <span style="color:#a855f7">const</span> base = <span style="color:#38bdf8">this</span>.selectedWeapon().baseDamage;
  <span style="color:#a855f7">const</span> statBonus = <span style="color:#38bdf8">this</span>.stats().${this.state.selectedWeapon().scalingStat} * <span style="color:#f87171">2.4</span>;
  <span style="color:#a855f7">const</span> aura = <span style="color:#38bdf8">this</span>.powerActive() ? <span style="color:#f87171">${this.state.selectedPower().powerMultiplier}</span> : <span style="color:#f87171">1.0</span>;

  <span style="color:#64748b">// LIVE COMPUTED RESULT:</span>
  <span style="color:#a855f7">return</span> <span style="color:#fbbf24">Math.round</span>((base + statBonus) * aura); <span style="color:#22c55e; font-weight:bold;">// =&gt; ${this.state.totalAttackPower()}</span>
});`;
  }

  getBindingsHtml(): string {
    return `<span style="color:#64748b">&lt;!-- 1. TWO-WAY BINDING: Banana in a Box [(ngModel)] --&gt;</span>
&lt;<span style="color:#f43f5e">input</span> 
  <span style="color:#38bdf8">type</span>=<span style="color:#a5f3fc">"text"</span> 
  <span style="color:#fbbf24; font-weight:bold;">[(ngModel)]</span>=<span style="color:#a5f3fc">"characterName"</span> 
/&gt;
<span style="color:#64748b">&lt;!-- Live In-Memory Value: "${this.escape(this.state.characterName())}" --&gt;</span>

<span style="color:#64748b">&lt;!-- 2. PROPERTY BINDING: [style.fill] (Component -&gt; DOM) --&gt;</span>
&lt;<span style="color:#f43f5e">ellipse</span> 
  <span style="color:#38bdf8">cx</span>=<span style="color:#f87171">"200"</span> <span style="color:#38bdf8">cy</span>=<span style="color:#f87171">"140"</span>
  <span style="color:#38bdf8; font-weight:bold;">[style.fill]</span>=<span style="color:#a5f3fc">"skinColor()"</span> 
/&gt;
<span style="color:#64748b">&lt;!-- Evaluates to: "${this.state.skinColor()}" --&gt;</span>

<span style="color:#64748b">&lt;!-- 3. EVENT BINDING: (click) (DOM -&gt; Component) --&gt;</span>
&lt;<span style="color:#f43f5e">button</span> <span style="color:#10b981; font-weight:bold;">(click)</span>=<span style="color:#a5f3fc">"equipWeapon(weapon)"</span>&gt;
  Equip {{ weapon.name }}
&lt;/<span style="color:#f43f5e">button</span>&gt;`;
  }

  getControlFlowHtml(): string {
    return `<span style="color:#64748b">&lt;!-- 1. CONTROL FLOW: &#64;if conditionally inserts/destroys DOM elements --&gt;</span>
<span style="color:#c084fc; font-weight:bold;">&#64;if</span> (powerActive()) {
  &lt;<span style="color:#f43f5e">g</span> <span style="color:#38bdf8">class</span>=<span style="color:#a5f3fc">"elemental-aura"</span>&gt;
    &lt;<span style="color:#f43f5e">circle</span> <span style="color:#38bdf8">r</span>=<span style="color:#f87171">"145"</span> <span style="color:#38bdf8">fill</span>=<span style="color:#a5f3fc">"url(#${this.state.selectedPower().element}Glow)"</span> /&gt;
  &lt;/<span style="color:#f43f5e">g</span>&gt;
} <span style="color:#c084fc; font-weight:bold;">&#64;else</span> {
  &lt;<span style="color:#f43f5e">span</span>&gt;Power Dormant&lt;/<span style="color:#f43f5e">span</span>&gt;
}

<span style="color:#64748b">&lt;!-- 2. CONTROL FLOW: &#64;for loops with mandatory track --&gt;</span>
<span style="color:#c084fc; font-weight:bold;">&#64;for</span> (w of weapons; <span style="color:#fbbf24">track</span> w.id) {
  &lt;<span style="color:#f43f5e">button</span> 
    <span style="color:#38bdf8">[class.card-active]</span>=<span style="color:#a5f3fc">"selectedWeapon().id === w.id"</span>
    <span style="color:#10b981">(click)</span>=<span style="color:#a5f3fc">"setWeapon(w)"</span>
  &gt;
    {{ w.iconSymbol }} {{ w.name }}
  &lt;/<span style="color:#f43f5e">button</span>&gt;
}`;
  }

  getStateJson(): string {
    return JSON.stringify(
      {
        characterName: this.state.characterName(),
        characterTitle: this.state.characterTitle(),
        selectedClass: this.state.selectedClass().name,
        skinColor: this.state.skinColor(),
        selectedHat: this.state.selectedHat().name,
        selectedOutfit: this.state.selectedOutfit().name,
        selectedWeapon: {
          name: this.state.selectedWeapon().name,
          element: this.state.selectedWeapon().element,
          baseDamage: this.state.selectedWeapon().baseDamage
        },
        powerActive: this.state.powerActive(),
        selectedPower: this.state.selectedPower().name,
        stats: this.state.stats(),
        availableStatPoints: this.state.availableStatPoints(),
        totalAttackPower: this.state.totalAttackPower(),
        defenseRating: this.state.defenseRating(),
        critChance: this.state.critChance() + '%',
        manaPool: this.state.manaPool() + ' MP',
        weaponSynergy: this.state.weaponSynergy()
      },
      null,
      2
    );
  }

  /**
   * Returns HTML-escaped JSON string wrapped in <code> tags for rendering
   * inside a scrollable code block.
   */
  getStateJsonHtml(): string {
    const rawJson = this.getStateJson();
    const escaped = this.escape(rawJson);
    return `<code>${escaped}</code>`;
  }

  private escape(str: string): string {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
