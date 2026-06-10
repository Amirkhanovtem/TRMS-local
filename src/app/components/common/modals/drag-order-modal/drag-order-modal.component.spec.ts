import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragOrderModalComponent } from './drag-order-modal.component';

describe('DragOrderModalComponent', () => {
  let component: DragOrderModalComponent;
  let fixture: ComponentFixture<DragOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragOrderModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
