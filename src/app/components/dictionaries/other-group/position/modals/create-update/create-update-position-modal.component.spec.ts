import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePositionModalComponent } from './create-update-position-modal.component';

describe('CreateUpdatePositionModalComponent', () => {
  let component: CreateUpdatePositionModalComponent;
  let fixture: ComponentFixture<CreateUpdatePositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdatePositionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdatePositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
