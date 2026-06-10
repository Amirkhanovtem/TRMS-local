import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateExamResultComponent } from './create-update-exam-result.component';

describe('CreateUpdateExamResultComponent', () => {
  let component: CreateUpdateExamResultComponent;
  let fixture: ComponentFixture<CreateUpdateExamResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateExamResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
