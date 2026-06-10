import { TestBed } from '@angular/core/testing';

import { SyllabusTemplateService } from './syllabus-template.service';

describe('SyllabusTemplateService', () => {
  let service: SyllabusTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyllabusTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
