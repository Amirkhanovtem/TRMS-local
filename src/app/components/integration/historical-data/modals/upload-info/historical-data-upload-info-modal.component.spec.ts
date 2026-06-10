import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDataUploadInfoModalComponent } from './historical-data-upload-info-modal.component';

describe('HistoricalDataUploadInfoModalComponent', () => {
  let component: HistoricalDataUploadInfoModalComponent;
  let fixture: ComponentFixture<HistoricalDataUploadInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoricalDataUploadInfoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalDataUploadInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
