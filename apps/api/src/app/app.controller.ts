import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { NewsEntry, SearchResult } from '@routee-serp/api-interfaces';
import { Observable } from 'rxjs';

import { SerpapiService } from './serpapi/serpapi.service';

@Controller()
export class AppController {
  constructor(private readonly serpApi: SerpapiService) {}

  @Get('search')
  getData(@Query('q') query: string): Observable<SearchResult[]> {
    if (!query) {
      throw new BadRequestException('Missing query parameter');
    }
    return this.serpApi.getSearchResults(query);
  }

  @Get('news')
  getNews(@Query('q') query: string): Observable<NewsEntry[]> {
    if (!query) {
      throw new BadRequestException('Missing query parameter');
    }
    return this.serpApi.getNews(query);
  }
}
