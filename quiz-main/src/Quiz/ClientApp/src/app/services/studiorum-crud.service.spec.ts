import { TestBed } from '@angular/core/testing';

import { StudiorumCrudService } from './studiorum-crud.service';

describe('StudiorumCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudiorumCrudService = TestBed.get(StudiorumCrudService);
    expect(service).toBeTruthy();
  });
});
