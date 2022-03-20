import { TestBed } from '@angular/core/testing';

import { QueryService } from './query.service';

describe('QueryService', () => {
  let service: QueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be initialized with null value', (done) => {
    service.value$.subscribe(value => {
      expect(value).toBeNull();
      done();
    })
  });
  it('should set value', (done) => {
    service.setValue('foo');
    service.value$.subscribe(value => {
      expect(value).toBe('foo');
      done();
    })
  });
  it('should drop value', (done) => {
    service.setValue('foo');
    service.dropValue();
    service.value$.subscribe(value => {
      expect(value).toBeNull();
      done();
    })
  });
});
