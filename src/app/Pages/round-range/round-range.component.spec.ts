import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundRangeComponent } from './round-range.component';

describe('RoundRangeComponent', () => {
  let component: RoundRangeComponent;
  let fixture: ComponentFixture<RoundRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
