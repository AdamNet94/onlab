import { TestBed } from '@angular/core/testing';

import { SignalAdminService } from './signal-admin.service';

describe('SignalAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignalAdminService = TestBed.get(SignalAdminService);
    expect(service).toBeTruthy();
  });
});
