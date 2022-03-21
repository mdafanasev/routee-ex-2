import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, of, startWith, switchMap } from 'rxjs';
import { QueryService } from '../query/query.service';
import { HomeService } from './home.service';

@Component({
  selector: 'serp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readonly results$ = this.queryService.value$.pipe(
    switchMap((query) => {
      if (query) {
        return this.homeService.getSearchReqults(query).pipe(startWith(null));
      }
      return of(null);
    })
  );

  public readonly isLoading$ = this.homeService.isLoading$;

  public readonly error$ = this.homeService.error$;

  constructor(
    private readonly queryService: QueryService,
    private readonly homeService: HomeService
  ) {}
}
