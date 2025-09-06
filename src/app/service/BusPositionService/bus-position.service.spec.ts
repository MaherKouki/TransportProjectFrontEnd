import { TestBed } from '@angular/core/testing';

import { BusPositionService } from './bus-position.service';

describe('BusPositionService', () => {
  let service: BusPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
