import { ComponentFixture } from '@angular/core/testing';

export class PageObject<T> {
  constructor(protected readonly fixture: ComponentFixture<T>) {}

  protected getByAutomationId(id: string): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(`*[data-test-id="${id}"]`);
  }
}
