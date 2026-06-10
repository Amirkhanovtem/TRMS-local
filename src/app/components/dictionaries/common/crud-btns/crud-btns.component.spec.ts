import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudBtnsComponent } from './crud-btns.component';

describe('CrudBtnsComponent', () => {
  let component: CrudBtnsComponent;
  let fixture: ComponentFixture<CrudBtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudBtnsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
