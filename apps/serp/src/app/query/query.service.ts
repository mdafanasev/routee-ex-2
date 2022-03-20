import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private readonly internalValue = new BehaviorSubject<string | null>(null);

  public readonly value$ = this.internalValue.asObservable();

  public setValue(query: string): void {
    this.internalValue.next(query);
  }

  public dropValue(): void {
    this.internalValue.next(null);
  }
}
