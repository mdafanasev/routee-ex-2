import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { RouterModule } from '@angular/router';
import { NewsCardComponent } from './news-card/news-card.component';
import { QueryModule } from '../query/query.module';

@NgModule({
  declarations: [NewsComponent, NewsCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NewsComponent }]),
    QueryModule,
  ],
})
export class NewsModule {}
