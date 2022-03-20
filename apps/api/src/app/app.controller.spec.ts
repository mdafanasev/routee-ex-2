import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchResult } from '@routee-serp/api-interfaces';
import { Observable, Subject } from 'rxjs';
import { AppController } from './app.controller';
import { SerpapiService } from './serpapi/serpapi.service';

describe('AppController', () => {
  let app: TestingModule;
  let searchResults$: Subject<SearchResult[]>;
  let serpapi: {
    getSearchResults: (query: string) => Observable<SearchResult[]>;
  };
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

  beforeAll(async () => {
    searchResults$ = new Subject<SearchResult[]>();
    serpapi = {
      getSearchResults: jest
        .fn()
        .mockImplementation(() => searchResults$.asObservable()),
    };
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: SerpapiService, useValue: serpapi }],
    }).compile();
  });

  describe('getSearchResults', () => {
    it('should return results from service', (done) => {
      const appController = app.get<AppController>(AppController);
      appController.getData('foo').subscribe((results) => {
        expect(results).toEqual(RESULTS);
        done();
      });
      searchResults$.next(RESULTS);
    });
    it('should pass query parameter to service', () => {
      const appController = app.get<AppController>(AppController);
      appController.getData('foo');
      expect(serpapi.getSearchResults).toBeCalledWith('foo');
    });

    it('should throw exception on empty query', () => {
      const appController = app.get<AppController>(AppController);
      expect(() => appController.getData('')).toThrow(BadRequestException);
    });
  });
});
