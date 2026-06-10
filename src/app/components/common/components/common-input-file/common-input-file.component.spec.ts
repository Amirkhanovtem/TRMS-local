import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonInputFileComponent } from './common-input-file.component';

describe('CommonInputFileComponent', () => {
  let component: CommonInputFileComponent;
  let fixture: ComponentFixture<CommonInputFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonInputFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonInputFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
