import { Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

export class PageObject<T> {
  constructor(protected readonly fixture: ComponentFixture<T>) {}

  protected getByAutomationId(id: string): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(`*[data-test-id="${id}"]`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getByDirective(directive: Type<any>) {
    return this.fixture.debugElement.query(By.directive(directive));
  }
}
