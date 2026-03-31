import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLayoutModelComponent } from './report-layout-model.component';

describe('ReportLayoutModelComponent', () => {
  let component: ReportLayoutModelComponent;
  let fixture: ComponentFixture<ReportLayoutModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLayoutModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLayoutModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
