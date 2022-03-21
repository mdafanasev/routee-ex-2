import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResult as SearchResultResponse } from '@routee-serp/api-interfaces';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { SearchResult } from './search-result.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private isLoadingState = new BehaviorSubject<boolean>(false);

  private errorState = new BehaviorSubject<string | null>(null);

  public isLoading$ = this.isLoadingState.asObservable();

  public error$ = this.errorState.asObservable();

  constructor(private readonly http: HttpClient) {}

  public getSearchReqults(query: string): Observable<SearchResult[]> {
    this.isLoadingState.next(true);
    this.errorState.next(null);
    return this.http.get<SearchResultResponse[]>(`/api/search?q=${query}`).pipe(
      tap(() => this.isLoadingState.next(false)),
      catchError((error) => {
        this.isLoadingState.next(false);
        if (error instanceof HttpErrorResponse) {
          this.errorState.next(error.error?.message || error.message);
        }
        return EMPTY;
      })
    );
  }
}
