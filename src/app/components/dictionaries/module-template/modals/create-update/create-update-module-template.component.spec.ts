import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateModuleTemplateComponent } from './create-update-module-template.component';

describe('CreateUpdateModuleTemplateComponent', () => {
  let component: CreateUpdateModuleTemplateComponent;
  let fixture: ComponentFixture<CreateUpdateModuleTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateModuleTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateModuleTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
