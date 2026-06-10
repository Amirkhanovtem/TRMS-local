import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCompanyModalComponent } from './create-update-company-modal.component';

describe('CreateUpdateCompanyModalComponent', () => {
  let component: CreateUpdateCompanyModalComponent;
  let fixture: ComponentFixture<CreateUpdateCompanyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateCompanyModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
