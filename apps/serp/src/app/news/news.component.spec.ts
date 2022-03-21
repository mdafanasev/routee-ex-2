import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageObject } from '@routee-serp/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { QueryService } from '../query/query.service';
import { NewsEntry } from './news-entry.model';
import { NewsComponent } from './news.component';
import { NewsService } from './news.service';

const NEWS: NewsEntry[] = [
  {
    position: 1,
    title: 'A',
    link: 'http://a.com',
    source: 'aaa',
    date: 'today',
    thumbnail: 'http://a.com',
    snippet: 'A snippet',
  },
  {
    position: 2,
    title: 'B',
    link: 'http://b.com',
    source: 'aaa',
    date: 'today',
    thumbnail: 'http://b.com',
    snippet: 'B snippet',
  },
];

@Component({ selector: 'serp-query', template: '' })
class MockQueryComponent {}

@Component({ selector: 'serp-news-card[data]', template: '' })
class MockNewsCardComponent {
  @Input() data!: NewsEntry;
}
class NewsPageObject extends PageObject<NewsComponent> {
  public get query() {
    return this.getByDirective(MockQueryComponent);
  }

  public get results() {
    return this.getByDirective(MockNewsCardComponent);
  }

  public get loader() {
    return this.getByAutomationId('serp-news__loader');
  }

  public get error() {
    return this.getByAutomationId('serp-news__error');
  }
}
describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let po: NewsPageObject;
  let queryService: Pick<QueryService, 'value$'>;
  let newsService: Pick<NewsService, 'getNews' | 'isLoading$' | 'error$'>;
  let query$: Subject<string | null>;
  let newsResults$: Subject<NewsEntry[] | null>;
  let isLoading$: BehaviorSubject<boolean>;
  let error$: BehaviorSubject<string | null>;

  beforeEach(async () => {
    query$ = new Subject<string | null>();
    newsResults$ = new Subject<NewsEntry[] | null>();
    isLoading$ = new BehaviorSubject<boolean>(false);
    error$ = new BehaviorSubject<string | null>(null);
    queryService = { value$: query$.asObservable() };
    newsService = {
      getNews: jest.fn().mockImplementation(() => newsResults$.asObservable()),
      isLoading$: isLoading$.asObservable(),
      error$: error$.asObservable(),
    };
    await TestBed.configureTestingModule({
      declarations: [NewsComponent, MockQueryComponent, MockNewsCardComponent],
      providers: [
        { provide: QueryService, useValue: queryService },
        { provide: NewsService, useValue: newsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    po = new NewsPageObject(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain query', () => {
    expect(po.query).toBeTruthy();
  });
  it('should not contain results on init', () => {
    expect(po.results).toBeFalsy();
  });
  it('should call HomeService on query update', () => {
    query$.next('foo');
    expect(newsService.getNews).toHaveBeenCalledWith('foo');
  });
  it('should display results from HomeService', () => {
    query$.next('foo');
    newsResults$.next(NEWS);
    fixture.detectChanges();
    expect(po.results).toBeTruthy();
  });
  it('should display error from HomeService', () => {
    error$.next('Error');
    fixture.detectChanges();
    expect(po.error).toBeTruthy();
  });
  it('should clear results on query update', () => {
    query$.next('foo');
    newsResults$.next(NEWS);
    query$.next('bar');
    fixture.detectChanges();
    expect(po.results).toBeFalsy();
  });
});
