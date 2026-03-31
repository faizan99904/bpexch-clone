import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundBetsComponent } from './round-bets.component';

describe('RoundBetsComponent', () => {
  let component: RoundBetsComponent;
  let fixture: ComponentFixture<RoundBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundBetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
