import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateLocationModalComponent } from './create-update-location-modal.component';

describe('CreateUpdateLocationModalComponent', () => {
  let component: CreateUpdateLocationModalComponent;
  let fixture: ComponentFixture<CreateUpdateLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateLocationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
