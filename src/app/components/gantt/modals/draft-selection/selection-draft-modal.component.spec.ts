import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDraftModalComponent } from './selection-draft-modal.component';

describe('SelectionDraftModalComponent', () => {
  let component: SelectionDraftModalComponent;
  let fixture: ComponentFixture<SelectionDraftModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectionDraftModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionDraftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
