import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportHistoryComponent } from './user-report-history.component';

describe('UserReportHistoryComponent', () => {
  let component: UserReportHistoryComponent;
  let fixture: ComponentFixture<UserReportHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReportHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
