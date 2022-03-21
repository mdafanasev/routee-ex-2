import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SearchResult as SearchResultResponse } from '@routee-serp/api-interfaces';
import { Subject } from 'rxjs';
import { HomeService } from './home.service';

const RESULTS: SearchResultResponse[] = [
  {
    position: 1,
    title: 'A',
    link: 'http://a.com',
    displayedLink: 'http://a.com',
    thumbnail: 'http://a.com',
    snippet: 'A snippet',
  },
  {
    position: 2,
    title: 'B',
    link: 'http://b.com',
    displayedLink: 'http://b.com',
    thumbnail: 'http://b.com',
    snippet: 'B snippet',
  },
];
describe('HomeService', () => {
  let service: HomeService;
  let resp$: Subject<SearchResultResponse[]>;
  let http: Pick<HttpClient, 'get'>;

  beforeEach(() => {
    resp$ = new Subject<SearchResultResponse[]>();
    http = { get: jest.fn().mockImplementation(() => resp$.asObservable()) };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }],
    });
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call HttpClient', () => {
    service.getSearchReqults('foo');
    expect(http.get).toHaveBeenCalled();
  });
  it('should respond with data', (done) => {
    service.getSearchReqults('foo').subscribe((resp) => {
      expect(resp).toEqual(RESULTS);
      done();
    });
    resp$.next(RESULTS);
  });
  it('should set isLoading$ to true on call', (done) => {
    service.getSearchReqults('foo').subscribe();
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeTruthy();
      done();
    });
  });
  it('should set isLoading$ to false after response', (done) => {
    service.getSearchReqults('foo').subscribe();
    resp$.next(RESULTS);
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalsy();
      done();
    });
  });
  it('should set isLoading$ to true on new response', (done) => {
    service.getSearchReqults('foo').subscribe();
    resp$.next(RESULTS);
    service.getSearchReqults('bar').subscribe();
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeTruthy();
      done();
    });
  });
  it('should set error$ on error', (done) => {
    service.getSearchReqults('foo').subscribe();
    resp$.error(new HttpErrorResponse({ error: { message: 'Error' } }));
    service.error$.subscribe((error) => {
      expect(error).toBeTruthy();
      done();
    });
  });
  it('should set error$ to null after second request', (done) => {
    service.getSearchReqults('foo').subscribe();
    resp$.error(new HttpErrorResponse({ error: { message: 'Error' } }));
    resp$ = new Subject<SearchResultResponse[]>();
    service.getSearchReqults('bar').subscribe();
    service.error$.subscribe((error) => {
      expect(error).toBeFalsy();
      done();
    });
  });
});
