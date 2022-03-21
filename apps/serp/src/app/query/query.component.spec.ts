import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PageObject } from '@routee-serp/utils';
import { Subject } from 'rxjs';
import { QueryComponent } from './query.component';
import { QueryService } from './query.service';

class QueryPageObject extends PageObject<QueryComponent> {
  public get input(): HTMLInputElement {
    return this.getByAutomationId('serp-query__input') as HTMLInputElement;
  }

  public get submitButton(): HTMLButtonElement {
    return this.getByAutomationId('serp-query__submit') as HTMLButtonElement;
  }

  public get resetButton(): HTMLButtonElement | null {
    return (
      (this.getByAutomationId('serp-query__reset') as HTMLButtonElement) || null
    );
  }

  public setInputValue(value: string): void {
    this.input.value = value;
    this.input.dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
  }

  public clickSubmit(): void {
    this.submitButton.dispatchEvent(new Event('click'));
    this.fixture.detectChanges();
  }

  public clickReset(): void {
    if (this.resetButton) {
      this.resetButton?.dispatchEvent(new Event('click'));
      this.fixture.detectChanges();
    }
  }
}
describe('QueryComponent', () => {
  let component: QueryComponent;
  let service: Pick<QueryService, 'value$' | 'setValue' | 'dropValue'>;
  let query$: Subject<string | null>;
  let fixture: ComponentFixture<QueryComponent>;
  let po: QueryPageObject;

  beforeEach(async () => {
    query$ = new Subject<string | null>();
    service = {
      value$: query$.asObservable(),
      setValue: jest.fn(),
      dropValue: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [QueryComponent],
      providers: [{ provide: QueryService, useValue: service }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    po = new QueryPageObject(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain input', () => {
    expect(po.input).toBeTruthy();
  });
  it('should contain submit button', () => {
    expect(po.submitButton).toBeTruthy();
  });
  it('should disable submit button until query is empty', () => {
    expect(po.submitButton.disabled).toBeTruthy();
  });
  it('should enable submit button when query is valid', () => {
    po.setInputValue('foo');
    expect(po.submitButton.disabled).toBeFalsy();
  });
  it('should disable drop button until query is empty', () => {
    expect(po.resetButton?.disabled).toBeTruthy();
  });
  it('should enable drop button when query is valid', () => {
    po.setInputValue('foo');
    expect(po.resetButton?.disabled).toBeFalsy();
  });
  it('should call service on submit', () => {
    po.setInputValue('foo');
    po.clickSubmit();
    expect(service.setValue).toBeCalledWith('foo');
  });
  it('should call service on drop', () => {
    po.setInputValue('foo');
    po.clickReset();
    expect(service.dropValue).toBeCalled();
  });
  it('should update input value on update from service', () => {
    query$.next('foo');
    fixture.detectChanges();
    expect(po.input.value).toBe('foo');
  });
});
