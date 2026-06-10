import { TestBed } from '@angular/core/testing';

import { NotificationTemplateCheckingService } from './notification-template-checking.service';

describe('NotificationTemplateCheckingService', () => {
  let service: NotificationTemplateCheckingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationTemplateCheckingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
