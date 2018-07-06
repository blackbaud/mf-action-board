import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { APP_LABELS } from './app.constants';
import {FakeRefreshService} from '../testing/fake-refresh.service';
import {RefreshService} from './refresh.service';
import {RouterTestingModule} from '@angular/router/testing';

let compiled;
let fixture;

const componentElements = {
  applicationTitle: () => { return compiled.querySelector('h1'); },
};

describe('App Component', () => {
    beforeEach(() => {
      compiled = createComponent();
    });
    it('should render title', () => {
      expect(componentElements.applicationTitle().textContent).toContain(APP_LABELS.TITLE);
    });
});

function createComponent() {
  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule
    ],
    providers: [
      {provide: RefreshService, useClass: FakeRefreshService}
    ],
    declarations: [
      AppComponent
    ]
  }).compileComponents();
  fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  return fixture.debugElement.nativeElement;
}
