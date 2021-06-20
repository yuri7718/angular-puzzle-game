import { TestBed } from '@angular/core/testing';

import { TimeBlockLimitationService } from './time-block-limitation.service';

describe('TimeBlockLimitationService', () => {
  let service: TimeBlockLimitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeBlockLimitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
