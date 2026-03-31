import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserDetailComponent } from './all-user-detail.component';

describe('AllUserDetailComponent', () => {
  let component: AllUserDetailComponent;
  let fixture: ComponentFixture<AllUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
