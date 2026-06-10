import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableResizeColumnComponent } from './table-resize-column.component';

describe('TableResizeColumnComponent', () => {
  let component: TableResizeColumnComponent;
  let fixture: ComponentFixture<TableResizeColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableResizeColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableResizeColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
