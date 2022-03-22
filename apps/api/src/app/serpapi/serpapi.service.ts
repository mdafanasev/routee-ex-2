import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsEntry, SearchResult } from '@routee-serp/api-interfaces';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SERPAPI_BASE } from './serpapi.const';

@Injectable()
export class SerpapiService {
  private readonly apiKey = this.config.get<string>('SERPAPI_KEY');

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {
    this.validateApiKey();
  }

  public getSearchResults(query: string): Observable<SearchResult[]> {
    return this.http
      .get(`${SERPAPI_BASE}/search.json`, {
        params: {
          q: query,
          api_key: this.apiKey,
        },
      })
      .pipe(
        map((resp) => {
          if (resp.data?.error) {
            throw new NotFoundException(resp.data.error);
          }
          return resp.data?.organic_results.map((result) => ({
            position: result.position,
            title: result.title,
            link: result.link,
            displayedLink: result.displayed_link,
            thumbnail: result.thumbnail,
            snippet: result.snippet,
          }));
        }),
        catchError((error) => {
          return throwError(
            new HttpException(error.response.statusText, error.response.status)
          );
        })
      );
  }

  public getNews(query: string): Observable<NewsEntry[]> {
    return this.http
      .get(`${SERPAPI_BASE}/search.json`, {
        params: {
          q: query,
          tbm: 'nws',
          api_key: this.apiKey,
        },
      })
      .pipe(
        map((resp) => {
          if (resp.data?.error) {
            throw new NotFoundException(resp.data.error);
          }
          return resp.data?.news_results.map((result) => ({
            position: result.position,
            title: result.title,
            link: result.link,
            source: result.source,
            date: result.date,
            thumbnail: result.thumbnail,
            snippet: result.snippet,
          }));
        }),
        catchError((error) => {
          return throwError(
            new HttpException(error.response.statusText, error.response.status)
          );
        })
      );
  }

  private validateApiKey(): void {
    if (!this.apiKey) {
      throw Error(
        'SERPAPI_KEY environment variable must be defined in environment!'
      );
    }
  }
}
