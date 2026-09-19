import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterStateService } from '../../services/character-state.service';

@Component({
  selector: 'app-character-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="canvas-container card-glass">
      <!-- Top Archetype Tag & Title Area -->
      <div class="header-hud">
        <div class="hud-top-meta">
          <!-- Current Character Archetype Tag -->
          <span class="archetype-tag" [style.borderColor]="state.selectedClass().badgeColor">
            <span class="archetype-dot" [style.backgroundColor]="state.selectedClass().badgeColor"></span>
            {{ state.selectedClass().name.toUpperCase() }}
          </span>

          <!-- Two-Way Binding Indicator Badge -->
          <div class="code-indicator" (click)="openBindingsTab()" title="Click to view [(ngModel)] in Code Peeker">
            <span class="pill-twoway">Two-Way: [(ngModel)]</span>
          </div>
        </div>

        <!-- Bold Character Title (Cinzel Serif Uppercase) -->
        <h2 class="character-bold-title">
          {{ (state.characterName() || 'Nameless Hero').toUpperCase() }}
        </h2>

        <!-- Character Subtitle -->
        <p class="character-subtitle">
          {{ state.characterTitle() }}
        </p>
      </div>

      <!-- Central Character Display Box -->
      <div 
        class="character-display-box"
        (click)="state.triggerAttack()"
        title="Click sprite to trigger Attack animation!"
      >
        <!-- Interactive 'Click Sprite to Attack' Action Button -->
        <button 
          class="attack-action-btn"
          (click)="$event.stopPropagation(); state.triggerAttack()"
          title="Trigger attack swing animation and sound"
        >
          <span class="attack-icon">⚔️</span>
          <span>Click Sprite to Attack</span>
        </button>

        <!-- Overlay Annotated Code Badges -->
        <div class="overlay-badge badge-top-left" (click)="$event.stopPropagation(); openBindingsTab()">
          <span class="pill-signal">Property: [style.fill]="skinColor()"</span>
        </div>

        <div class="overlay-badge badge-bottom-left" (click)="$event.stopPropagation(); openDirectivesTab()">
          <span class="pill-directive">Control Flow: &#64;if (powerActive())</span>
        </div>

        <!-- 2D SVG Character Preview (High-Detail Realistic Hero Avatar) -->
        <svg
          class="character-svg float-bob"
          [class.anim-attacking]="state.isAttacking()"
          viewBox="0 0 400 460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <!-- Elemental Aura Gradients -->
            <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFF7ED" stop-opacity="0.95" />
              <stop offset="35%" stop-color="#FF5E00" stop-opacity="0.7" />
              <stop offset="70%" stop-color="#EF4444" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#7F1D1D" stop-opacity="0" />
            </radialGradient>

            <radialGradient id="frostGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
              <stop offset="35%" stop-color="#00D2FF" stop-opacity="0.75" />
              <stop offset="70%" stop-color="#0284C7" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#082F49" stop-opacity="0" />
            </radialGradient>

            <radialGradient id="lightningGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FEF9C3" stop-opacity="0.95" />
              <stop offset="40%" stop-color="#FFE600" stop-opacity="0.7" />
              <stop offset="75%" stop-color="#CA8A04" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#713F12" stop-opacity="0" />
            </radialGradient>

            <radialGradient id="voidGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#F5D0FE" stop-opacity="0.9" />
              <stop offset="40%" stop-color="#A855F7" stop-opacity="0.7" />
              <stop offset="75%" stop-color="#6B21A8" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#3B0764" stop-opacity="0" />
            </radialGradient>

            <!-- Metallic Shading Gradients for Realistic Armor & Weapons -->
            <linearGradient id="metalPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94A3B8" />
              <stop offset="30%" stop-color="#E2E8F0" />
              <stop offset="60%" stop-color="#475569" />
              <stop offset="100%" stop-color="#1E293B" />
            </linearGradient>

            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FEF08A" />
              <stop offset="40%" stop-color="#FACC15" />
              <stop offset="80%" stop-color="#CA8A04" />
              <stop offset="100%" stop-color="#854D0E" />
            </linearGradient>

            <linearGradient id="leatherTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#44403C" />
              <stop offset="50%" stop-color="#292524" />
              <stop offset="100%" stop-color="#1C1917" />
            </linearGradient>

            <linearGradient id="hairShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="40%" stop-color="#334155" />
              <stop offset="100%" stop-color="#0F172A" />
            </linearGradient>

            <radialGradient id="eyeIris" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="65%" stop-color="#0284C7" />
              <stop offset="100%" stop-color="#082F49" />
            </radialGradient>

            <!-- Glow / Neon Filters -->
            <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Ground Contact Shadow -->
          <ellipse cx="200" cy="425" rx="85" ry="14" fill="rgba(0, 0, 0, 0.6)" />

          <!-- CONTROL FLOW SHOWCASE: @if (state.powerActive()) renders the Aura -->
          @if (state.powerActive()) {
            <g class="power-aura-group">
              @if (state.selectedPower().element === 'flame') {
                <circle cx="200" cy="225" r="145" fill="url(#flameGlow)" />
                <circle cx="200" cy="225" r="118" stroke="#FF5E00" stroke-width="2" stroke-dasharray="8 6" opacity="0.8" class="aura-spinner" />
                <polygon points="190,75 200,45 210,75" fill="#FF5E00" opacity="0.85" />
                <polygon points="110,180 85,160 115,165" fill="#FF5E00" opacity="0.85" />
                <polygon points="290,180 315,160 285,165" fill="#FF5E00" opacity="0.85" />
              } @else if (state.selectedPower().element === 'frost') {
                <circle cx="200" cy="225" r="145" fill="url(#frostGlow)" />
                <circle cx="200" cy="225" r="120" stroke="#00D2FF" stroke-width="2.5" stroke-dasharray="14 10" opacity="0.85" class="aura-spinner" />
                <polygon points="195,65 200,40 205,65 200,90" fill="#BAE6FD" />
                <polygon points="100,170 75,175 100,180 120,175" fill="#BAE6FD" />
                <polygon points="300,170 325,175 300,180 280,175" fill="#BAE6FD" />
              } @else if (state.selectedPower().element === 'lightning') {
                <circle cx="200" cy="225" r="145" fill="url(#lightningGlow)" />
                <polyline points="180,55 195,90 185,110 215,145" stroke="#FFE600" stroke-width="3" fill="none" />
                <polyline points="85,195 115,210 100,225 135,235" stroke="#FFE600" stroke-width="3" fill="none" />
                <polyline points="315,195 285,210 300,225 265,235" stroke="#FFE600" stroke-width="3" fill="none" />
              } @else {
                <circle cx="200" cy="225" r="150" fill="url(#voidGlow)" />
                <circle cx="200" cy="225" r="122" stroke="#C084FC" stroke-width="3" stroke-dasharray="20 12" opacity="0.85" class="aura-spinner-reverse" />
              }
            </g>
          }

          <!-- Back Layer: Flowing Cape / Robe Back -->
          @if (state.selectedOutfit().type === 'robe') {
            <path d="M 150 205 Q 120 340 135 410 Q 200 425 265 410 Q 280 340 250 205 Z" fill="#2E1065" opacity="0.95" />
          } @else if (state.selectedOutfit().type === 'plate') {
            <path d="M 155 205 Q 130 320 140 395 Q 200 405 260 395 Q 270 320 245 205 Z" fill="#991B1B" opacity="0.8" />
          }

          <!-- REALISTIC CHARACTER ANATOMY -->
          <g id="realistic-body">
            <!-- 1. Legs & Armored Greaves -->
            <!-- Left Leg -->
            <path d="M 162 315 L 160 380 L 150 415 L 188 415 L 188 380 L 192 315 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />
            <!-- Right Leg -->
            <path d="M 208 315 L 212 380 L 212 415 L 250 415 L 240 380 L 238 315 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            <!-- Knee Guards (Poleyns) -->
            <circle cx="174" cy="355" r="9" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1" />
            <circle cx="226" cy="355" r="9" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1" />

            <!-- Armored Boots / Sabatons with Soles -->
            <path d="M 148 408 L 188 408 L 192 422 L 142 422 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <path d="M 212 408 L 252 408 L 258 422 L 208 422 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <!-- Sole Tread -->
            <line x1="140" y1="422" x2="194" y2="422" stroke="#0F172A" stroke-width="3" />
            <line x1="206" y1="422" x2="260" y2="422" stroke="#0F172A" stroke-width="3" />

            <!-- 2. Heroic Torso & Chest Armor -->
            <!-- Tapered Athletic Torso -->
            <path d="M 148 185 Q 140 250 162 315 L 238 315 Q 260 250 252 185 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            <!-- Detailed Layered Outfit Variations -->
            @if (state.selectedOutfit().type === 'plate') {
              <!-- Paladin Heavy Cuirass with Beveled Breastplate -->
              <path d="M 152 188 Q 200 215 248 188 L 240 270 Q 200 295 160 270 Z" fill="url(#metalPlate)" stroke="#EAB308" stroke-width="2" />
              <!-- Golden Lion / Radiant Crest -->
              <polygon points="200,215 208,235 200,248 192,235" fill="url(#goldTrim)" />
              <circle cx="200" cy="235" r="4" fill="#EF4444" />
              <!-- Armor Segment Lines & Rivets -->
              <path d="M 165 240 Q 200 255 235 240" fill="none" stroke="#EAB308" stroke-width="1.5" />
              <circle cx="160" cy="205" r="2.5" fill="#FEF08A" />
              <circle cx="240" cy="205" r="2.5" fill="#FEF08A" />
              <!-- Gilded Belt & Buckle -->
              <rect x="160" y="295" width="80" height="15" rx="3" fill="#1C1917" stroke="#EAB308" stroke-width="1.5" />
              <rect x="192" y="292" width="16" height="21" rx="2" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1" />
              <!-- Hanging Armored Tassets (Hip Guards) -->
              <polygon points="162,310 188,310 182,340 166,340" fill="url(#metalPlate)" stroke="#EAB308" stroke-width="1" />
              <polygon points="212,310 238,310 234,340 218,340" fill="url(#metalPlate)" stroke="#EAB308" stroke-width="1" />
            } @else if (state.selectedOutfit().type === 'robe') {
              <!-- Archmage Velvet Robe with Cascading Rune Stoles -->
              <path d="M 172 188 L 172 335 L 228 335 L 228 188 Z" [style.fill]="state.selectedOutfit().trimColor" />
              <!-- Gold Celestial Stole Trim -->
              <line x1="172" y1="188" x2="172" y2="335" stroke="url(#goldTrim)" stroke-width="3" />
              <line x1="228" y1="188" x2="228" y2="335" stroke="url(#goldTrim)" stroke-width="3" />
              <!-- Embroidered Runes on Stole -->
              <text x="195" y="240" font-size="14" fill="#FEF08A" font-family="serif">✦</text>
              <text x="195" y="275" font-size="14" fill="#FEF08A" font-family="serif">❖</text>
              <text x="195" y="310" font-size="14" fill="#FEF08A" font-family="serif">✦</text>
              <!-- Glowing Mana Brooch -->
              <circle cx="200" cy="205" r="10" fill="#00D2FF" stroke="#FFFFFF" stroke-width="2" filter="url(#neonBlur)" />
              <!-- Flowing Sash Belt -->
              <rect x="160" y="285" width="80" height="12" rx="2" fill="url(#goldTrim)" />
              <path d="M 188 297 L 184 350 L 196 350 L 192 297 Z" fill="url(#goldTrim)" />
            } @else if (state.selectedOutfit().type === 'cyber') {
              <!-- Hyperdrive Cyber Suit with Hex Panels & Reactor Core -->
              <path d="M 160 195 L 200 220 L 240 195 L 235 285 L 200 305 L 165 285 Z" fill="#0F172A" stroke="#00D2FF" stroke-width="2" />
              <!-- Illuminated Glowing Conduits -->
              <line x1="170" y1="205" x2="195" y2="245" stroke="#00D2FF" stroke-width="3.5" filter="url(#neonBlur)" />
              <line x1="230" y1="205" x2="205" y2="245" stroke="#00D2FF" stroke-width="3.5" filter="url(#neonBlur)" />
              <line x1="200" y1="260" x2="200" y2="300" stroke="#00D2FF" stroke-width="3" filter="url(#neonBlur)" />
              <!-- Arc Reactor Chest Core -->
              <polygon points="200,230 216,245 200,260 184,245" fill="#00D2FF" stroke="#FFFFFF" stroke-width="2" filter="url(#neonBlur)" />
              <circle cx="200" cy="245" r="4" fill="#FFFFFF" />
              <!-- High-tech Belt -->
              <rect x="162" y="295" width="76" height="14" rx="3" fill="#1E293B" stroke="#00D2FF" stroke-width="1.5" />
            } @else {
              <!-- Rogue Midnight Leathers with Crossed Bandolier & Daggers -->
              <path d="M 152 190 L 248 190 L 240 290 L 160 290 Z" fill="url(#leatherTone)" stroke="#10B981" stroke-width="1.5" />
              <!-- Crossed Weapon Straps -->
              <line x1="152" y1="195" x2="240" y2="285" stroke="#78716C" stroke-width="7" />
              <line x1="152" y1="195" x2="240" y2="285" stroke="#44403C" stroke-width="3" />
              <line x1="248" y1="195" x2="160" y2="285" stroke="#78716C" stroke-width="7" />
              <line x1="248" y1="195" x2="160" y2="285" stroke="#44403C" stroke-width="3" />
              <!-- Throwing Daggers on Harness -->
              <polygon points="180,225 186,238 183,248 177,235" fill="#E2E8F0" stroke="#0F172A" stroke-width="1" />
              <polygon points="214,225 220,238 217,248 211,235" fill="#E2E8F0" stroke="#0F172A" stroke-width="1" />
              <circle cx="200" cy="240" r="8" [style.fill]="state.selectedOutfit().trimColor" stroke="#FEF08A" stroke-width="1.5" />
            }

            <!-- 3. Pauldrons (Shoulder Guards) -->
            <!-- Left Pauldron (3-Tier Layered Plate) -->
            <path d="M 130 180 Q 148 168 165 185 L 160 215 Q 140 225 125 205 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <path d="M 125 200 Q 140 215 155 205 L 150 225 Q 135 235 122 220 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            <!-- Right Pauldron -->
            <path d="M 270 180 Q 252 168 235 185 L 240 215 Q 260 225 275 205 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <path d="M 275 200 Q 260 215 245 205 L 250 225 Q 265 235 278 220 Z" [style.fill]="state.selectedOutfit().baseColor" stroke="#0F172A" stroke-width="1.5" />

            <!-- 4. Athletic Neck & Collarbones -->
            <path d="M 186 168 L 186 195 Q 200 200 214 195 L 214 168 Z" [style.fill]="state.skinColor()" />
            <!-- Neck shadow under chin -->
            <polygon points="186,168 214,168 206,182 194,182" fill="rgba(0,0,0,0.22)" />
            <!-- Collarbone lines -->
            <path d="M 178 194 Q 192 198 200 196 Q 208 198 222 194" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2" stroke-linecap="round" />

            <!-- 5. Sculpted Head & Facial Anatomy (Bound to skinColor()) -->
            <!-- Natural Jawline and Chin -->
            <path d="M 166 120 C 164 150 175 174 200 174 C 225 174 236 150 234 120 C 234 85 166 85 166 120 Z" [style.fill]="state.skinColor()" stroke="#0F172A" stroke-width="1.5" />

            <!-- Left Ear -->
            <path d="M 166 122 C 160 122 159 138 166 142 Z" [style.fill]="state.skinColor()" stroke="#0F172A" stroke-width="1" />
            <!-- Right Ear -->
            <path d="M 234 122 C 240 122 241 138 234 142 Z" [style.fill]="state.skinColor()" stroke="#0F172A" stroke-width="1" />

            <!-- Stylized Anime/RPG Eyes & Facial Features -->
            <g class="hero-face">
              <!-- Eyebrows (Heroic Tilted Arch) -->
              <path d="M 174 120 Q 185 116 192 121" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round" />
              <path d="M 226 120 Q 215 116 208 121" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round" />

              <!-- Left Eye (Sclera, Iris with Depth, Highlights) -->
              <ellipse cx="184" cy="130" rx="8" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
              <circle cx="184" cy="130" r="4.5" fill="url(#eyeIris)" />
              <circle cx="184" cy="130" r="2.2" fill="#0B0E14" />
              <!-- Specular Reflections (Life in Eyes) -->
              <circle cx="182.5" cy="128.5" r="1.5" fill="#FFFFFF" />
              <circle cx="185.5" cy="132" r="0.8" fill="#FFFFFF" />
              <!-- Upper Eyelid Crease -->
              <path d="M 176 127 Q 184 123 192 127" fill="none" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />

              <!-- Right Eye -->
              <ellipse cx="216" cy="130" rx="8" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
              <circle cx="216" cy="130" r="4.5" fill="url(#eyeIris)" />
              <circle cx="216" cy="130" r="2.2" fill="#0B0E14" />
              <!-- Specular Reflections -->
              <circle cx="214.5" cy="128.5" r="1.5" fill="#FFFFFF" />
              <circle cx="217.5" cy="132" r="0.8" fill="#FFFFFF" />
              <!-- Upper Eyelid Crease -->
              <path d="M 208 127 Q 216 123 224 127" fill="none" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />

              <!-- Sculpted Nose Bridge & Nostril Shadow -->
              <path d="M 200 128 L 198 142 L 202 143" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linecap="round" />

              <!-- Determined Heroic Mouth & Lower Lip Shadow -->
              <path d="M 193 154 Q 200 157 207 154" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
              <path d="M 197 158 Q 200 160 203 158" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1.5" />
            </g>

            <!-- Dynamic Layered Hero Hair -->
            <g id="hero-hair">
              <!-- Back Hair Tufts -->
              <path d="M 164 105 Q 155 130 162 145 Q 165 125 168 115 Z" fill="url(#hairShade)" />
              <path d="M 236 105 Q 245 130 238 145 Q 235 125 232 115 Z" fill="url(#hairShade)" />
              <!-- Forehead Swept Hair Locks -->
              <path d="M 166 112 Q 175 90 200 90 Q 225 90 234 112 Q 225 102 215 105 Q 200 95 185 105 Q 175 102 166 112 Z" fill="url(#hairShade)" />
              <path d="M 175 95 L 180 115 L 188 100 L 196 116 L 205 98 L 214 115 L 222 96 Z" fill="url(#hairShade)" />
            </g>

            <!-- 6. Articulated Left Arm (Holding Weapon) -->
            <!-- Bicep & Forearm -->
            <path d="M 145 195 Q 118 230 102 268" fill="none" stroke-width="20" [style.stroke]="state.skinColor()" stroke-linecap="round" />
            <!-- Vambrace / Arm Bracer -->
            <path d="M 132 215 L 102 265 L 112 272 L 142 222 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <!-- Articulated Gauntlet Hand with Fingers around Grip -->
            <circle cx="100" cy="270" r="13" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <!-- Knuckle Guards -->
            <rect x="92" y="263" width="16" height="6" rx="2" fill="url(#goldTrim)" />

            <!-- 7. Articulated Right Arm (Heroic Combat Pose) -->
            <path d="M 255 195 Q 282 230 298 268" fill="none" stroke-width="20" [style.stroke]="state.skinColor()" stroke-linecap="round" />
            <path d="M 268 215 L 298 265 L 288 272 L 258 222 Z" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="1.5" />
            <circle cx="300" cy="270" r="13" [style.fill]="state.selectedOutfit().trimColor" stroke="#0F172A" stroke-width="2" />
            <rect x="292" y="263" width="16" height="6" rx="2" fill="url(#goldTrim)" />
          </g>

          <!-- REALISTIC HEADGEAR LAYER -->
          <g id="realistic-headgear">
            @if (state.selectedHat().type === 'helm') {
              <!-- Viking War Helm with Realistic Curved Horns & Nasal Guard -->
              <!-- Chainmail Coif Back -->
              <path d="M 160 115 Q 155 160 170 172 Q 200 178 230 172 Q 245 160 240 115 Z" fill="#475569" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="2 2" />
              <!-- Steel Spangenhelm Dome -->
              <path d="M 162 125 C 162 70 238 70 238 125 Z" fill="url(#metalPlate)" stroke="#1E293B" stroke-width="2" />
              <!-- Brass Reinforced Brow Band with Rivets -->
              <path d="M 160 118 Q 200 112 240 118 L 240 128 Q 200 122 160 128 Z" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1.5" />
              <circle cx="170" cy="123" r="2" fill="#0B0E14" />
              <circle cx="185" cy="121" r="2" fill="#0B0E14" />
              <circle cx="200" cy="120" r="2" fill="#0B0E14" />
              <circle cx="215" cy="121" r="2" fill="#0B0E14" />
              <circle cx="230" cy="123" r="2" fill="#0B0E14" />
              <!-- Nasal Guard down over nose -->
              <polygon points="196,124 204,124 202,142 198,142" fill="url(#metalPlate)" stroke="#1E293B" stroke-width="1.5" />

              <!-- Left 3D Dragon/Ram Horn with Ridges -->
              <path d="M 165 116 C 135 105 105 60 118 35 C 136 60 148 92 168 108 Z" fill="#F8FAFC" stroke="#475569" stroke-width="2" />
              <line x1="152" y1="95" x2="140" y2="85" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="142" y1="78" x2="130" y2="68" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="130" y1="60" x2="122" y2="52" stroke="#94A3B8" stroke-width="1.5" />

              <!-- Right 3D Dragon/Ram Horn with Ridges -->
              <path d="M 235 116 C 265 105 295 60 282 35 C 264 60 252 92 232 108 Z" fill="#F8FAFC" stroke="#475569" stroke-width="2" />
              <line x1="248" y1="95" x2="260" y2="85" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="258" y1="78" x2="270" y2="68" stroke="#94A3B8" stroke-width="1.5" />
              <line x1="270" y1="60" x2="278" y2="52" stroke="#94A3B8" stroke-width="1.5" />
            } @else if (state.selectedHat().type === 'wizard') {
              <!-- Starseeker Wizard Hat with Sweeping Brim & Astral Folds -->
              <!-- Wide Sweeping Flapped Brim -->
              <path d="M 120 128 C 145 110 255 110 280 128 C 260 142 140 142 120 128 Z" fill="#1E1B4B" stroke="#4338CA" stroke-width="2" />
              <!-- Tall Crumpled Arcane Cone -->
              <path d="M 152 122 Q 190 28 238 12 Q 212 65 248 122 Z" fill="#312E81" stroke="#6366F1" stroke-width="2" />
              <!-- Gold Moon Buckle & Belt -->
              <path d="M 154 118 Q 200 110 246 118 L 244 126 Q 200 118 156 126 Z" fill="url(#goldTrim)" />
              <circle cx="200" cy="119" r="8" fill="#FFE600" stroke="#CA8A04" stroke-width="1.5" />
              <circle cx="203" cy="119" r="6" fill="#312E81" />
              <!-- Glowing Stardust Charm at the Tip -->
              <polygon points="238,8 242,16 250,17 244,22 246,30 238,26 230,30 232,22 226,17 234,16" fill="#FFE600" filter="url(#neonBlur)" />
            } @else if (state.selectedHat().type === 'visor') {
              <!-- Neon Cyber Visor with Holographic HUD Reticle -->
              <path d="M 156 118 Q 200 114 244 118 L 242 142 Q 200 148 158 142 Z" fill="#0B0E14" stroke="#00D2FF" stroke-width="2.5" />
              <!-- Neon HUD Scanline -->
              <line x1="162" y1="130" x2="238" y2="130" stroke="#00D2FF" stroke-width="3" filter="url(#neonBlur)" />
              <!-- Targeting Hex Reticle in Visor Center -->
              <polygon points="200,124 205,127 205,133 200,136 195,133 195,127" fill="none" stroke="#FFE600" stroke-width="1.5" />
              <!-- Side Carbon Fiber Temple Earpieces -->
              <rect x="152" y="122" width="8" height="18" rx="2" fill="#334155" stroke="#00D2FF" stroke-width="1" />
              <rect x="240" y="122" width="8" height="18" rx="2" fill="#334155" stroke="#00D2FF" stroke-width="1" />
            } @else if (state.selectedHat().type === 'crown') {
              <!-- Crown of Radiance with Filigree & Bejeweled Gemstones -->
              <path d="M 158 126 L 162 88 L 178 110 L 200 75 L 222 110 L 238 88 L 242 126 Z" fill="url(#goldTrim)" stroke="#854D0E" stroke-width="2" />
              <!-- Central Crimson Ruby -->
              <polygon points="200,85 206,94 200,103 194,94" fill="#EF4444" stroke="#FFFFFF" stroke-width="1" filter="url(#neonBlur)" />
              <!-- Left Sapphire -->
              <circle cx="166" cy="98" r="4" fill="#3B82F6" stroke="#FFFFFF" stroke-width="0.8" />
              <!-- Right Sapphire -->
              <circle cx="234" cy="98" r="4" fill="#3B82F6" stroke="#FFFFFF" stroke-width="0.8" />
              <!-- Lower Filigree Rim Jewels -->
              <circle cx="180" cy="120" r="3" fill="#10B981" />
              <circle cx="200" cy="119" r="3.5" fill="#FFE600" />
              <circle cx="220" cy="120" r="3" fill="#10B981" />
            } @else {
              <!-- Shinobi Cowl with Ninja Mask -->
              <path d="M 152 135 C 146 75 254 75 248 135 C 244 155 230 168 200 168 C 170 168 156 155 152 135 Z" fill="#18181B" stroke="#27272A" stroke-width="2" />
              <!-- Face Mask covering lower face -->
              <path d="M 166 138 Q 200 134 234 138 L 228 168 Q 200 172 172 168 Z" fill="#27272A" stroke="#10B981" stroke-width="1.5" />
              <!-- Trailing Ninja Scarf billowing back -->
              <path d="M 235 155 Q 275 140 305 160 Q 280 175 240 165 Z" fill="#10B981" opacity="0.9" />
            }
          </g>

          <!-- WEAPON LAYER (Left Hand at x=100, y=270) -->
          <g id="realistic-weapon" transform="translate(100, 270) rotate(-15)">
            @if (state.selectedWeapon().type === 'sword') {
              <!-- Infernal Sunblade: Dragon-Guard Broadsword with Fire Core -->
              <!-- Pommel & Leather Wrapped Grip -->
              <circle cx="0" cy="35" r="7" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1.5" />
              <rect x="-4" y="0" width="8" height="35" rx="2" fill="#78350F" />
              <!-- Ornate Dragon Crossguard -->
              <path d="M -26 -2 Q 0 -10 26 -2 L 20 8 Q 0 2 -20 8 Z" fill="url(#goldTrim)" stroke="#0F172A" stroke-width="1.5" />
              <circle cx="0" cy="2" r="5" fill="#EF4444" />
              <!-- Flaming Solar Blade -->
              <path d="M -10 -6 L 0 -145 L 10 -6 Z" fill="#FF5E00" stroke="#FF5E00" stroke-width="2" filter="url(#neonBlur)" />
              <path d="M -5 -6 L 0 -135 L 5 -6 Z" fill="#FFE600" />
              <line x1="0" y1="-6" x2="0" y2="-125" stroke="#FFFFFF" stroke-width="2" />
            } @else if (state.selectedWeapon().type === 'staff') {
              <!-- Glacial Scepter: Runic Silver Staff with Floating Azure Diamond -->
              <line x1="0" y1="65" x2="0" y2="-130" stroke="#0284C7" stroke-width="8" stroke-linecap="round" />
              <line x1="0" y1="60" x2="0" y2="-125" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
              <!-- Gold Astral Prongs Framing the Floating Gem -->
              <path d="M -16 -120 Q -24 -145 0 -168 Q 24 -145 16 -120" fill="none" stroke="url(#goldTrim)" stroke-width="3" />
              <!-- Floating Azure Diamond -->
              <polygon points="0,-182 18,-150 0,-118 -18,-150" fill="#00D2FF" stroke="#FFFFFF" stroke-width="2" filter="url(#neonBlur)" />
              <circle cx="0" cy="-150" r="5" fill="#FFFFFF" />
            } @else if (state.selectedWeapon().type === 'bow') {
              <!-- Thunderbolt Recurve Bow (CORRECTED: Facing Forward/Outward to Left, Arrow Aiming Away from Body) -->
              <!-- Ergonomic Central Riser Grip in Hand -->
              <rect x="-4" y="-18" width="8" height="36" rx="3" fill="#1C1917" stroke="url(#goldTrim)" stroke-width="1.5" />

              <!-- Recurve Limbs Arched FORWARD to the Left (Toward Target at Negative X) -->
              <!-- Upper Limb bending outward to left and curving forward -->
              <path d="M 0 -18 Q -38 -65 -32 -115 Q -28 -125 -18 -130" fill="none" stroke="#FFE600" stroke-width="7" stroke-linecap="round" filter="url(#neonBlur)" />
              <path d="M 0 -18 Q -38 -65 -32 -115 Q -28 -125 -18 -130" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round" />

              <!-- Lower Limb bending outward to left and curving forward -->
              <path d="M 0 18 Q -38 65 -32 115 Q -28 125 -18 130" fill="none" stroke="#FFE600" stroke-width="7" stroke-linecap="round" filter="url(#neonBlur)" />
              <path d="M 0 18 Q -38 65 -32 115 Q -28 125 -18 130" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round" />

              <!-- Bowstring connecting Limb Tips at Inner Position -->
              <line x1="-18" y1="-130" x2="-18" y2="130" stroke="#FEF08A" stroke-width="2" stroke-dasharray="6 2" />

              <!-- CHARGED LIGHTNING ARROW: Nocked on string & pointing FORWARD (Left / Negative X into Battlefield) -->
              <!-- Shaft pointing from string (-18) forward to broadhead (-90) -->
              <line x1="8" y1="0" x2="-90" y2="0" stroke="#00D2FF" stroke-width="3.5" filter="url(#neonBlur)" />
              <line x1="8" y1="0" x2="-90" y2="0" stroke="#FFFFFF" stroke-width="1.5" />
              <!-- Broadhead Arrowhead Pointing Left (-X) -->
              <polygon points="-90,0 -76,-8 -80,0 -76,8" fill="#00D2FF" stroke="#FFFFFF" stroke-width="1.5" filter="url(#neonBlur)" />
              <!-- Arrow Fletchings at String End -->
              <polygon points="5,-6 8,0 5,6 0,0" fill="#FFE600" />
              <polygon points="-5,-6 -2,0 -5,6 -10,0" fill="#FFE600" />
            } @else if (state.selectedWeapon().type === 'scythe') {
              <!-- Void Eclipse Scythe with Curved Energy Blade -->
              <path d="M 0 65 Q -6 -60 0 -150" stroke="#4C1D95" stroke-width="8" fill="none" stroke-linecap="round" />
              <!-- Curved Void Blade -->
              <path d="M 0 -140 Q -65 -175 -110 -130 Q -50 -120 0 -110 Z" fill="#A855F7" stroke="#C084FC" stroke-width="2.5" filter="url(#neonBlur)" />
              <circle cx="-50" cy="-135" r="8" fill="#C084FC" filter="url(#neonBlur)" />
            } @else if (state.selectedWeapon().type === 'daggers') {
              <!-- Twin Venom Daggers -->
              <rect x="-4" y="0" width="8" height="25" fill="#047857" rx="2" />
              <path d="M -7 0 L 0 -80 L 7 0 Z" fill="#10B981" stroke="#34D399" stroke-width="2" filter="url(#neonBlur)" />
              <path d="M 12 12 L 25 -55 L 22 12 Z" fill="#059669" stroke="#34D399" stroke-width="1.5" filter="url(#neonBlur)" />
            } @else {
              <!-- Cosmic Wand with Spinning Star Gyroscope -->
              <line x1="0" y1="35" x2="0" y2="-95" stroke="#BE185D" stroke-width="6" stroke-linecap="round" />
              <circle cx="0" cy="-105" r="16" fill="#F43F5E" stroke="#FFFFFF" stroke-width="2" filter="url(#neonBlur)" />
              <circle cx="0" cy="-105" r="7" fill="#FFE600" />
            }
          </g>
        </svg>
      </div>

      <!-- Combat Power Footer: Dynamic Stat Box calculating total power using computed() -->
      <div class="combat-power-footer">
        <div class="combat-footer-header">
          <div class="footer-title-wrap">
            <span class="combat-title">COMBAT POWER</span>
            <span class="pill-computed">computed()</span>
          </div>
          <span class="synergy-status-badge" [class.synergy-glow]="state.weaponSynergy().active">
            {{ state.weaponSynergy().level }}
          </span>
        </div>

        <div class="power-value-row">
          <div class="main-power-box">
            <span class="power-number">{{ state.totalAttackPower() }}</span>
            <span class="power-label">TOTAL ATK</span>
          </div>

          <div class="power-breakdown-chips">
            <div class="chip-item">
              <span class="chip-k">DEF</span>
              <span class="chip-v">{{ state.defenseRating() }}</span>
            </div>
            <div class="chip-item">
              <span class="chip-k">CRIT</span>
              <span class="chip-v">{{ state.critChance() }}%</span>
            </div>
            <div class="chip-item">
              <span class="chip-k">MANA</span>
              <span class="chip-v">{{ state.manaPool() }} MP</span>
            </div>
          </div>
        </div>

        <!-- Power Gauge Bar -->
        <div class="gauge-bar-track">
          <div 
            class="gauge-bar-fill"
            [style.width.%]="Math.min(100, (state.totalAttackPower() / 160) * 100)"
          ></div>
        </div>

        <div class="footer-synergy-desc">
          <span>{{ state.weaponSynergy().description }} ({{ state.weaponSynergy().bonus }})</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .canvas-container {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      padding: 1.35rem;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.85rem;
      position: relative;
    }

    .header-hud {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: #0B0E14;
      padding: 0.85rem 1.25rem;
      border-radius: 0.65rem;
      border: 1px solid var(--border-subtle);
    }

    .hud-top-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 0.4rem;
    }

    .archetype-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 800;
      color: #FFFFFF;
      background: rgba(11, 14, 20, 0.9);
      border: 1px solid;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      letter-spacing: 0.06em;
    }

    .archetype-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      box-shadow: 0 0 6px currentColor;
    }

    .code-indicator {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .code-indicator:hover {
      transform: scale(1.05);
    }

    .character-bold-title {
      font-family: var(--font-rpg);
      font-size: 1.7rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #FFFFFF;
      margin: 0.2rem 0 0.15rem 0;
      text-shadow: 0 0 16px rgba(0, 210, 255, 0.45);
      word-break: break-word;
    }

    .character-subtitle {
      font-size: 0.82rem;
      color: #00D2FF;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.02em;
    }

    /* Central Character Display Box */
    .character-display-box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at 50% 60%, #1A1F2C 0%, #0B0E14 80%);
      border-radius: 0.75rem;
      border: 1px solid var(--border-subtle);
      min-height: 385px;
      cursor: pointer;
      overflow: hidden;
      user-select: none;
      transition: border-color 0.25s;
    }

    .character-display-box:hover {
      border-color: rgba(0, 210, 255, 0.45);
    }

    .attack-action-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(11, 14, 20, 0.85);
      border: 1px solid rgba(0, 210, 255, 0.4);
      border-radius: 0.45rem;
      padding: 0.35rem 0.65rem;
      color: #00D2FF;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: var(--font-code);
      cursor: pointer;
      z-index: 20;
      transition: all 0.2s;
    }

    .attack-action-btn:hover {
      background: #00D2FF;
      color: #0B0E14;
      box-shadow: 0 0 14px rgba(0, 210, 255, 0.6);
      transform: scale(1.04);
    }

    .attack-icon {
      font-size: 0.85rem;
    }

    /* Annotated Code Badges Overlays */
    .overlay-badge {
      position: absolute;
      z-index: 15;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .overlay-badge:hover {
      transform: translateY(-2px) scale(1.04);
    }

    .badge-top-left {
      top: 14px;
      left: 14px;
    }

    .badge-bottom-left {
      bottom: 14px;
      left: 14px;
    }

    .character-svg {
      width: 100%;
      max-width: 380px;
      height: 370px;
      transform-origin: center bottom;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .aura-spinner {
      animation: spin 14s linear infinite;
      transform-origin: 200px 220px;
    }

    .aura-spinner-reverse {
      animation: spinReverse 16s linear infinite;
      transform-origin: 200px 220px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes spinReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    /* Combat Power Footer */
    .combat-power-footer {
      background: #0B0E14;
      border: 1px solid var(--border-subtle);
      border-radius: 0.65rem;
      padding: 0.95rem 1.15rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .combat-footer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .combat-title {
      font-family: var(--font-rpg);
      font-size: 0.85rem;
      font-weight: 800;
      color: #E2E8F0;
      letter-spacing: 0.06em;
    }

    .synergy-status-badge {
      font-family: var(--font-code);
      font-size: 0.72rem;
      font-weight: 700;
      color: #94A3B8;
      background: #161923;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid var(--border-subtle);
    }

    .synergy-glow {
      color: #FFE600 !important;
      border-color: rgba(255, 230, 0, 0.4) !important;
      box-shadow: 0 0 10px rgba(255, 230, 0, 0.25);
    }

    .power-value-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .main-power-box {
      display: flex;
      align-items: baseline;
      gap: 0.45rem;
    }

    .power-number {
      font-family: var(--font-code);
      font-size: 2.2rem;
      font-weight: 800;
      color: #00D2FF;
      line-height: 1;
      text-shadow: 0 0 16px rgba(0, 210, 255, 0.6);
    }

    .power-label {
      font-family: var(--font-code);
      font-size: 0.82rem;
      font-weight: 700;
      color: #94A3B8;
    }

    .power-breakdown-chips {
      display: flex;
      gap: 0.4rem;
    }

    .chip-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #161923;
      border: 1px solid var(--border-subtle);
      border-radius: 0.35rem;
      padding: 0.3rem 0.6rem;
      min-width: 52px;
    }

    .chip-k {
      font-family: var(--font-code);
      font-size: 0.62rem;
      color: #64748B;
      font-weight: 700;
    }

    .chip-v {
      font-family: var(--font-code);
      font-size: 0.85rem;
      color: #E2E8F0;
      font-weight: 800;
    }

    .gauge-bar-track {
      width: 100%;
      height: 8px;
      background: #161923;
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }

    .gauge-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3B82F6, #00D2FF, #A855F7);
      border-radius: 9999px;
      transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.8);
    }

    .footer-synergy-desc {
      font-size: 0.72rem;
      color: #94A3B8;
      line-height: 1.3;
    }
  `]
})
export class CharacterCanvasComponent {
  state = inject(CharacterStateService);
  Math = Math;

  openBindingsTab(): void {
    this.state.openCodePeekerWithTab('bindings');
  }

  openDirectivesTab(): void {
    this.state.openCodePeekerWithTab('directives');
  }
}
