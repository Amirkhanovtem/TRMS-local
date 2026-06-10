import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AimsIntegrationInfoDetailModalComponent } from './aims-integration-info-detail-modal.component';

describe('AimsIntegrationInfoDetailModalComponent', () => {
  let component: AimsIntegrationInfoDetailModalComponent;
  let fixture: ComponentFixture<AimsIntegrationInfoDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AimsIntegrationInfoDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AimsIntegrationInfoDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
