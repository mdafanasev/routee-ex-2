import { ChangeDetectionStrategy, Component } from '@angular/core';
import { delay, of, startWith, switchMap } from 'rxjs';
import { QueryService } from '../query/query.service';
import { NewsService } from './news.service';

@Component({
  selector: 'serp-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  public readonly results$ = this.queryService.value$.pipe(
    switchMap((query) => {
      if (query) {
        return this.newsService.getNews(query).pipe(startWith(null));
      }
      return of(null);
    })
  );

  public readonly isLoading$ = this.newsService.isLoading$.pipe(
    delay(0) // Forces async pipe to update value on first render
  );

  public readonly error$ = this.newsService.error$;

  constructor(
    private readonly queryService: QueryService,
    private readonly newsService: NewsService
  ) {}
}
