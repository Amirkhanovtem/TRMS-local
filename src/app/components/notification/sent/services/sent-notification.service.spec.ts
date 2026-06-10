import { TestBed } from '@angular/core/testing';

import { SentNotificationService } from './sent-notification.service';

describe('SentNotificationService', () => {
  let service: SentNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
