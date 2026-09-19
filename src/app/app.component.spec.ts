import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CharacterStateService } from './services/character-state.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [CharacterStateService]
    }).compileComponents();
  });

  it('should create the standalone customizer app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize character state with reactive signals', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.state.characterName()).toBeTruthy();
    expect(app.state.totalAttackPower()).toBeGreaterThan(0);
  });

  it('should toggle presenter mode when triggered', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const initial = app.state.presenterMode();
    app.state.togglePresenterMode();
    expect(app.state.presenterMode()).toBe(!initial);
  });
});
