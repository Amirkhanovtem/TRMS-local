import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsedModalListComponent } from './collapsed-modal-list.component';

describe('CollapsedModalListComponent', () => {
  let component: CollapsedModalListComponent;
  let fixture: ComponentFixture<CollapsedModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollapsedModalListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsedModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
