import { TestBed } from '@angular/core/testing';

import { NewsService } from './news.service';
import { NewsEntry as NewsEntryResponse } from '@routee-serp/api-interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

const NEWS: NewsEntryResponse[] = [
  {
    position: 1,
    title: 'A',
    link: 'http://a.com',
    source: 'aaa',
    date: 'today',
    thumbnail: 'http://a.com',
    snippet: 'A snippet',
  },
  {
    position: 2,
    title: 'B',
    link: 'http://b.com',
    source: 'aaa',
    date: 'today',
    thumbnail: 'http://b.com',
    snippet: 'B snippet',
  },
];
describe('NewsService', () => {
  let service: NewsService;
  let resp$: Subject<NewsEntryResponse[]>;
  let http: Pick<HttpClient, 'get'>;

  beforeEach(() => {
    resp$ = new Subject<NewsEntryResponse[]>();
    http = { get: jest.fn().mockImplementation(() => resp$.asObservable()) };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }],
    });
    service = TestBed.inject(NewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call HttpClient', () => {
    service.getNews('foo');
    expect(http.get).toHaveBeenCalled();
  });
  it('should respond with data', (done) => {
    service.getNews('foo').subscribe((resp) => {
      expect(resp).toEqual(NEWS);
      done();
    });
    resp$.next(NEWS);
  });
  it('should set isLoading$ to true on call', (done) => {
    service.getNews('foo').subscribe();
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeTruthy();
      done();
    });
  });
  it('should set isLoading$ to false after response', (done) => {
    service.getNews('foo').subscribe();
    resp$.next(NEWS);
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalsy();
      done();
    });
  });
  it('should set isLoading$ to true on new response', (done) => {
    service.getNews('foo').subscribe();
    resp$.next(NEWS);
    service.getNews('bar').subscribe();
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeTruthy();
      done();
    });
  });
  it('should set error$ on error', (done) => {
    service.getNews('foo').subscribe();
    resp$.error(new HttpErrorResponse({ error: { message: 'Error' } }));
    service.error$.subscribe((error) => {
      expect(error).toBeTruthy();
      done();
    });
  });
  it('should set error$ to null after second request', (done) => {
    service.getNews('foo').subscribe();
    resp$.error(new HttpErrorResponse({ error: { message: 'Error' } }));
    resp$ = new Subject<NewsEntryResponse[]>();
    service.getNews('bar').subscribe();
    service.error$.subscribe((error) => {
      expect(error).toBeFalsy();
      done();
    });
  });
});
