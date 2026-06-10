import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTreeSelectionModalComponent } from './common-tree-selection-modal.component';

describe('CommonTreeSelectionModalComponent', () => {
  let component: CommonTreeSelectionModalComponent;
  let fixture: ComponentFixture<CommonTreeSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonTreeSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonTreeSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
