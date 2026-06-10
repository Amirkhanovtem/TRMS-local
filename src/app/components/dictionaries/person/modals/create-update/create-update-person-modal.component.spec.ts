import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePersonModalComponent } from './create-update-person-modal.component';

describe('CreateUpdatePersonModalComponent', () => {
  let component: CreateUpdatePersonModalComponent;
  let fixture: ComponentFixture<CreateUpdatePersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdatePersonModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdatePersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
