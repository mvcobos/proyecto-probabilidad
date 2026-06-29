import { TestBed } from '@angular/core/testing';

import { Malla } from './malla';

describe('Malla', () => {
  let service: Malla;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Malla);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
