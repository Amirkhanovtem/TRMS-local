import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonHierarchyFilterComponent } from './person-hierarchy-filter.component';

describe('PersonHierarchyFilterComponent', () => {
  let component: PersonHierarchyFilterComponent;
  let fixture: ComponentFixture<PersonHierarchyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonHierarchyFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonHierarchyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
