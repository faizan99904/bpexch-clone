import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorEventComponent } from './operator-event.component';

describe('OperatorEventComponent', () => {
  let component: OperatorEventComponent;
  let fixture: ComponentFixture<OperatorEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
