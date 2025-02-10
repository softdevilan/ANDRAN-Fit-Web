import { TestBed } from '@angular/core/testing';

import { PseudoauthService } from './pseudoauth.service';

describe('PseudoauthService', () => {
  let service: PseudoauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
