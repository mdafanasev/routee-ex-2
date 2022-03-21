import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SearchResult } from '../search-result.model';

@Component({
  selector: 'serp-search-entry[data]',
  templateUrl: './search-entry.component.html',
  styleUrls: ['./search-entry.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchEntryComponent {
  @Input() public data!: SearchResult;
}
