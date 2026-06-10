import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodeBtnsComponent } from './tree-node-btns.component';

describe('TreeNodeBtnsComponent', () => {
  let component: TreeNodeBtnsComponent;
  let fixture: ComponentFixture<TreeNodeBtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TreeNodeBtnsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeNodeBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
