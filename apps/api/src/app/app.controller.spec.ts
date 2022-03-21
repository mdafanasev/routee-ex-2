import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NewsEntry, SearchResult } from '@routee-serp/api-interfaces';
import { Observable, Subject } from 'rxjs';
import { AppController } from './app.controller';
import { SerpapiService } from './serpapi/serpapi.service';

const RESULTS: SearchResult[] = [
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
const NEWS_RESULTS: NewsEntry[] = [
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
describe('AppController', () => {
  let app: TestingModule;
  let searchResults$: Subject<SearchResult[]>;
  let newsResults$: Subject<NewsEntry[]>;
  let serpapi: Pick<SerpapiService, 'getSearchResults' | 'getNews'>;

  beforeAll(async () => {
    searchResults$ = new Subject<SearchResult[]>();
    newsResults$ = new Subject<NewsEntry[]>();
    serpapi = {
      getSearchResults: jest
        .fn()
        .mockImplementation(() => searchResults$.asObservable()),
      getNews: jest
        .fn()
        .mockImplementation(() => newsResults$.asObservable()),
    };
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: SerpapiService, useValue: serpapi }],
    }).compile();
  });

  describe('getSearchResults', () => {
    it('should return results from search', (done) => {
      const appController = app.get<AppController>(AppController);
      appController.getData('foo').subscribe((results) => {
        expect(results).toEqual(RESULTS);
        done();
      });
      searchResults$.next(RESULTS);
    });
    it('should pass query parameter to search', () => {
      const appController = app.get<AppController>(AppController);
      appController.getData('foo');
      expect(serpapi.getSearchResults).toBeCalledWith('foo');
    });

    it('should throw exception on empty query for search', () => {
      const appController = app.get<AppController>(AppController);
      expect(() => appController.getData('')).toThrow(BadRequestException);
    });
    it('should return results from news', (done) => {
      const appController = app.get<AppController>(AppController);
      appController.getNews('foo').subscribe((results) => {
        expect(results).toEqual(NEWS_RESULTS);
        done();
      });
      newsResults$.next(NEWS_RESULTS);
    });
    it('should pass query parameter to search', () => {
      const appController = app.get<AppController>(AppController);
      appController.getNews('foo');
      expect(serpapi.getNews).toBeCalledWith('foo');
    });

    it('should throw exception on empty query for search', () => {
      const appController = app.get<AppController>(AppController);
      expect(() => appController.getNews('')).toThrow(BadRequestException);
    });
  });
});
