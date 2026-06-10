import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDataUploadModalComponent } from './historical-data-upload-modal.component';

describe('HistoricalDataUploadModalComponent', () => {
  let component: HistoricalDataUploadModalComponent;
  let fixture: ComponentFixture<HistoricalDataUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoricalDataUploadModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalDataUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
