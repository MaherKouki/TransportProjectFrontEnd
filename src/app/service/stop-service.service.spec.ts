import { TestBed } from '@angular/core/testing';

import { StopServiceService } from './stop-service.service';

describe('StopServiceService', () => {
  let service: StopServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StopServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
