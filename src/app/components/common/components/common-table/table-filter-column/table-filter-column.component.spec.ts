import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterColumnComponent } from './table-filter-column.component';

describe('TableFilterColumnComponent', () => {
  let component: TableFilterColumnComponent;
  let fixture: ComponentFixture<TableFilterColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableFilterColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFilterColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
