import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCityModalComponent } from './create-update-city-modal.component';

describe('CreateUpdateCityModalComponent', () => {
  let component: CreateUpdateCityModalComponent;
  let fixture: ComponentFixture<CreateUpdateCityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateCityModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
