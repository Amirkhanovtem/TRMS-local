import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSaveVisualComponent } from './table-save-visual.component';

describe('TableSaveVisualComponent', () => {
  let component: TableSaveVisualComponent;
  let fixture: ComponentFixture<TableSaveVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableSaveVisualComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableSaveVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
