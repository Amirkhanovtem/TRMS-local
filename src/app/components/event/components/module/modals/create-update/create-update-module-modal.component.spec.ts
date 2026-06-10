import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateModuleModalComponent } from './create-update-module-modal.component';

describe('CreateUpdateModuleModalComponent', () => {
  let component: CreateUpdateModuleModalComponent;
  let fixture: ComponentFixture<CreateUpdateModuleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateModuleModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateModuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
