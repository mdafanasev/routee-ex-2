import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageObject } from '@routee-serp/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { QueryService } from '../query/query.service';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { SearchResult } from './search-result.model';

const RESULTS: SearchResult[] = [
  {
    position: 1,
    title: 'A',
    link: 'http://a.com',
    displayedLink: 'http://a.com',
    thumbnail: 'http://a.com',
    snippet: 'A snippet',
  },
  {
    position: 2,
    title: 'B',
    link: 'http://b.com',
    displayedLink: 'http://b.com',
    thumbnail: 'http://b.com',
    snippet: 'B snippet',
  },
];
@Component({ selector: 'serp-query', template: '' })
class MockQueryComponent {}

@Component({ selector: 'serp-search-entry[data]', template: '' })
class MockSearchEntryComponent {
  @Input() data!: SearchResult;
}

class HomePageObject extends PageObject<HomeComponent> {
  public get query() {
    return this.getByDirective(MockQueryComponent);
  }

  public get results() {
    return this.getByDirective(MockSearchEntryComponent);
  }

  public get loader() {
    return this.getByAutomationId('serp-home__loader');
  }

  public get error() {
    return this.getByAutomationId('serp-home__error');
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let po: HomePageObject;
  let queryService: Pick<QueryService, 'value$'>;
  let homeService: Pick<
    HomeService,
    'getSearchReqults' | 'isLoading$' | 'error$'
  >;
  let query$: Subject<string | null>;
  let searchResults$: Subject<SearchResult[] | null>;
  let isLoading$: BehaviorSubject<boolean>;
  let error$: BehaviorSubject<string | null>;

  beforeEach(async () => {
    query$ = new Subject<string | null>();
    searchResults$ = new Subject<SearchResult[] | null>();
    isLoading$ = new BehaviorSubject<boolean>(false);
    error$ = new BehaviorSubject<string | null>(null);
    queryService = { value$: query$.asObservable() };
    homeService = {
      getSearchReqults: jest
        .fn()
        .mockImplementation(() => searchResults$.asObservable()),
      isLoading$: isLoading$.asObservable(),
      error$: error$.asObservable(),
    };
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockQueryComponent,
        MockSearchEntryComponent,
      ],
      providers: [
        { provide: QueryService, useValue: queryService },
        { provide: HomeService, useValue: homeService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    po = new HomePageObject(fixture);
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
    expect(homeService.getSearchReqults).toHaveBeenCalledWith('foo');
  });
  it('should display loading status when isLoading$ is truthy', () => {
    isLoading$.next(true);
    fixture.detectChanges();
    expect(po.loader).toBeTruthy();
  });
  it('should not display loading status when isLoading$ is falsy', () => {
    isLoading$.next(true);
    isLoading$.next(false);
    fixture.detectChanges();
    expect(po.loader).toBeFalsy();
  });
  it('should display results from HomeService', () => {
    query$.next('foo');
    searchResults$.next(RESULTS);
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
    searchResults$.next(RESULTS);
    query$.next('bar');
    fixture.detectChanges();
    expect(po.results).toBeFalsy();
  });
});
