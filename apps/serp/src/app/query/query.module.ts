import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QueryComponent } from './query.component';

@NgModule({
  declarations: [QueryComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [QueryComponent],
})
export class QueryModule {}
