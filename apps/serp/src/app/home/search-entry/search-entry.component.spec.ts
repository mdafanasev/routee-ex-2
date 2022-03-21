import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageObject } from '@routee-serp/utils';
import { SearchResult } from '../search-result.model';

import { SearchEntryComponent } from './search-entry.component';

const DATA: SearchResult = {
  position: 1,
  title: 'A',
  link: 'http://a.com/foo',
  displayedLink: 'http://a.com > foo',
  thumbnail: 'http://a.com/thumb.png',
  snippet: 'A snippet',
};

class SearchEntryPageObject extends PageObject<SearchEntryComponent> {
  public get title() {
    return this.getByAutomationId('serp-search-entry__title');
  }
  public get link() {
    return this.getByAutomationId('serp-search-entry__link') as HTMLLinkElement;
  }
  public get snippet() {
    return this.getByAutomationId('serp-search-entry__snippet');
  }
  public get thumb() {
    return this.getByAutomationId(
      'serp-search-entry__thumb'
    ) as HTMLImageElement;
  }
}

describe('SearchEntryComponent', () => {
  let component: SearchEntryComponent;
  let fixture: ComponentFixture<SearchEntryComponent>;
  let po: SearchEntryPageObject;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchEntryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEntryComponent);
    component = fixture.componentInstance;
    component.data = DATA;
    fixture.detectChanges();
    po = new SearchEntryPageObject(fixture);
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
  it('should contain title', () => {
    expect(po.title?.textContent).toBe(DATA.title);
  });
  it('should contain link', () => {
    expect(po.link?.textContent).toBe(DATA.displayedLink);
  });
  it('should contain link with correct href', () => {
    expect(po.link?.href).toBe(DATA.link);
  });
  it('should contain snippet', () => {
    expect(po.snippet?.textContent).toBe(DATA.snippet);
  });
  it('should contain thumbnail', () => {
    expect(po.thumb.src).toBe(DATA.thumbnail);
  });
});
