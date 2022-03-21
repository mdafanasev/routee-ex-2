import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsEntry, SearchResult } from '@routee-serp/api-interfaces';
import { map, Observable } from 'rxjs';
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
      .get(
        `${SERPAPI_BASE}/search.json?q=${query}&hl=en&gl=us&api_key=${this.apiKey}`
      )
      .pipe(
        map((resp) =>
          resp.data?.organic_results.map((result) => ({
            position: result.position,
            title: result.title,
            link: result.link,
            displayedLink: result.displayed_link,
            thumbnail: result.thumbnail,
            snippet: result.snippet,
          }))
        )
      );
  }

  public getNews(query: string): Observable<NewsEntry[]> {
    return this.http
      .get(
        `${SERPAPI_BASE}/search.json?q=${query}&tbm=nws&api_key=${this.apiKey}`
      )
      .pipe(
        map((resp) =>
          resp.data?.news_results.map((result) => ({
            position: result.position,
            title: result.title,
            link: result.link,
            source: result.source,
            date: result.date,
            thumbnail: result.thumbnail,
            snippet: result.snippet,
          }))
        )
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
