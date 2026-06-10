import { TestBed } from '@angular/core/testing';

import { TargetNotificationTemplateService } from './target-notification-template.service';

describe('EventNotificationTemplateService', () => {
  let service: TargetNotificationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetNotificationTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
