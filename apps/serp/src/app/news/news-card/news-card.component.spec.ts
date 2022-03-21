import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageObject } from '@routee-serp/utils';
import { NewsEntry } from '../news-entry.model';
import { NewsCardComponent } from './news-card.component';

const DATA: NewsEntry = {
  position: 1,
  title: 'A',
  link: 'http://a.com/foo',
  source: 'aaa',
  date: 'today',
  thumbnail: 'http://a.com/image.png',
  snippet: 'A snippet',
};

class NewsCardPageObject extends PageObject<NewsCardComponent> {
  public get title() {
    return this.getByAutomationId('serp-news-card__title');
  }
  public get link() {
    return this.getByAutomationId('serp-news-card__link') as HTMLLinkElement;
  }
  public get snippet() {
    return this.getByAutomationId('serp-news-card__snippet');
  }
  public get thumb() {
    return this.getByAutomationId('serp-news-card__thumb') as HTMLImageElement;
  }
  public get date() {
    return this.getByAutomationId('serp-news-card__date');
  }
  public get source() {
    return this.getByAutomationId('serp-news-card__source');
  }
}
describe('NewsCardComponent', () => {
  let component: NewsCardComponent;
  let fixture: ComponentFixture<NewsCardComponent>;
  let po: NewsCardPageObject;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCardComponent);
    component = fixture.componentInstance;
    component.data = DATA;
    fixture.detectChanges();
    po = new NewsCardPageObject(fixture);
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
  it('should contain title', () => {
    expect(po.title?.textContent).toBe(DATA.title);
  });
  it('should contain link', () => {
    expect(po.link?.textContent).toBe(DATA.link);
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
  it('should contain date', () => {
    expect(po.date?.textContent).toBe(DATA.date);
  });
  it('should contain source', () => {
    expect(po.source?.textContent).toBe(DATA.source);
  });
});
