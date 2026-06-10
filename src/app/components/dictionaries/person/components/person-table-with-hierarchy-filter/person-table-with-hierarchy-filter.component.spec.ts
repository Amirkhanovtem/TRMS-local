import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTableWithHierarchyFilterComponent } from './person-table-with-hierarchy-filter.component';

describe('PersonTableWithHierarchyFilterComponent', () => {
  let component: PersonTableWithHierarchyFilterComponent;
  let fixture: ComponentFixture<PersonTableWithHierarchyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonTableWithHierarchyFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonTableWithHierarchyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
