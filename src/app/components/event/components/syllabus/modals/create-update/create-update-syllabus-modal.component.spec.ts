import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateSyllabusModalComponent } from './create-update-syllabus-modal.component';

describe('CreateUpdateSyllabusModalComponent', () => {
  let component: CreateUpdateSyllabusModalComponent;
  let fixture: ComponentFixture<CreateUpdateSyllabusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateSyllabusModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateSyllabusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
