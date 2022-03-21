import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { QueryService } from './query.service';

@Component({
  selector: 'serp-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryComponent implements OnInit, OnDestroy {
  public readonly queryControl = new FormControl('', [Validators.required]);

  public readonly form = new FormGroup({ query: this.queryControl });

  private get controlValue(): string | null {
    if (this.isFormValid) {
      return this.queryControl.value.trim();
    } else {
      return null;
    }
  }

  public get isFormValid(): boolean {
    return this.form.valid;
  }

  private destroy$ = new Subject<void>();

  constructor(private readonly queryService: QueryService) {}

  public ngOnInit(): void {
    this.queryService.value$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateControlValue(value);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public submit(): void {
    if (this.isFormValid) {
      this.updateQuery();
    }
  }

  public updateQuery(): void {
    if (this.controlValue) {
      this.queryService.setValue(this.controlValue);
    } else {
      this.dropQuery();
    }
  }

  public dropQuery(): void {
    this.queryService.dropValue();
  }

  private updateControlValue(query: string | null) {
    if (query) {
      this.queryControl.setValue(query);
    } else {
      this.queryControl.reset();
    }
  }
}
