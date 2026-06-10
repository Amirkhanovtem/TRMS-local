import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AimsIntegrationInfoComponent } from './aims-integration-info.component';

describe('AimsIntegrationInfoComponent', () => {
  let component: AimsIntegrationInfoComponent;
  let fixture: ComponentFixture<AimsIntegrationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AimsIntegrationInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AimsIntegrationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
