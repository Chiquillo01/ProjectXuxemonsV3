import { TestBed } from '@angular/core/testing';

import { CurarService } from './contactos.service';

describe('CurarService', () => {
  let service: CurarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
