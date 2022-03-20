import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueryService } from '../query/query.service';

@Component({
  selector: 'serp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readonly query$ = this.queryService.value$;

  constructor(private readonly queryService: QueryService) {}
}
