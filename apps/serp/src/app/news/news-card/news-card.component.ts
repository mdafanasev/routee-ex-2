import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NewsEntry } from '../news-entry.model';

@Component({
  selector: 'serp-news-card[data]',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCardComponent {
  @Input() public data!: NewsEntry;
}
