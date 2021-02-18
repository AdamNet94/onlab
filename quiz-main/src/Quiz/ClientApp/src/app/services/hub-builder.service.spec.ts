import { TestBed } from '@angular/core/testing';

import { HubBuilderService } from './hub-builder.service';

describe('HubBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HubBuilderService = TestBed.get(HubBuilderService);
    expect(service).toBeTruthy();
  });
});
