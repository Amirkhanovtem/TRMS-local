import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCreateUpdateTreeNodeModalComponent } from './default-create-update-tree-node-modal.component';

describe('CreateUpdateTreeNodeModalComponent', () => {
  let component: DefaultCreateUpdateTreeNodeModalComponent;
  let fixture: ComponentFixture<DefaultCreateUpdateTreeNodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultCreateUpdateTreeNodeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultCreateUpdateTreeNodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
