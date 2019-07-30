import { TestBed } from '@angular/core/testing';

import { UuidsService } from './uuids.service';

describe('UuidsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UuidsService = TestBed.get(UuidsService);
    expect(service).toBeTruthy();
  });
});
