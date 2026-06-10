import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSyllabusesComponent } from './complete-syllabuses.component';

describe('CompletedSyllabusesComponent', () => {
  let component: CompleteSyllabusesComponent;
  let fixture: ComponentFixture<CompleteSyllabusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteSyllabusesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteSyllabusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
