import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonUploadFileBtnComponent } from './common-upload-file-btn.component';

describe('CommonUploadFileBtnComponent', () => {
  let component: CommonUploadFileBtnComponent;
  let fixture: ComponentFixture<CommonUploadFileBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonUploadFileBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonUploadFileBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
