import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { QueryModule } from '../query/query.module';
import { SearchEntryComponent } from './search-entry/search-entry.component';

@NgModule({
  declarations: [HomeComponent, SearchEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    QueryModule,
  ],
})
export class HomeModule {}
