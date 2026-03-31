import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDwComponent } from './request-dw.component';

describe('RequestDwComponent', () => {
  let component: RequestDwComponent;
  let fixture: ComponentFixture<RequestDwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
