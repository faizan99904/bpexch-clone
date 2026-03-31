import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoundRangeComponent } from './user-round-range.component';

describe('UserRoundRangeComponent', () => {
  let component: UserRoundRangeComponent;
  let fixture: ComponentFixture<UserRoundRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoundRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoundRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
