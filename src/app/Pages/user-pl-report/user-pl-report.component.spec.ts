import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlReportComponent } from './user-pl-report.component';

describe('UserPlReportComponent', () => {
  let component: UserPlReportComponent;
  let fixture: ComponentFixture<UserPlReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPlReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
