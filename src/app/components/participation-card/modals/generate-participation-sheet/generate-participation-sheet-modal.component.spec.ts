import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateParticipationSheetModalComponent } from './generate-participation-sheet-modal.component';

describe('GenerateParticipationSheetModalComponent', () => {
  let component: GenerateParticipationSheetModalComponent;
  let fixture: ComponentFixture<GenerateParticipationSheetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateParticipationSheetModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateParticipationSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
