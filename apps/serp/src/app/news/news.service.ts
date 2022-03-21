import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewsEntry as NewsEntryResponse } from '@routee-serp/api-interfaces';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { NewsEntry } from './news-entry.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private isLoadingState = new BehaviorSubject<boolean>(false);

  private errorState = new BehaviorSubject<string | null>(null);

  public isLoading$ = this.isLoadingState.asObservable();

  public error$ = this.errorState.asObservable();

  constructor(private readonly http: HttpClient) {}

  public getNews(query: string): Observable<NewsEntry[]> {
    this.isLoadingState.next(true);
    this.errorState.next(null);
    return this.http.get<NewsEntryResponse[]>(`/api/news?q=${query}`).pipe(
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
