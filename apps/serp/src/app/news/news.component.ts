import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'serp-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {}
