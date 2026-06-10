import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHideColumnComponent } from './table-hide-column.component';

describe('TableHideColumnComponent', () => {
  let component: TableHideColumnComponent;
  let fixture: ComponentFixture<TableHideColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableHideColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableHideColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
