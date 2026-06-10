import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingNewEventModalComponent } from './creating-new-event-modal.component';

describe('CreatingNewEventModalComponent', () => {
  let component: CreatingNewEventModalComponent;
  let fixture: ComponentFixture<CreatingNewEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingNewEventModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatingNewEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
