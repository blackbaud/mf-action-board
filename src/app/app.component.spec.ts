import {TestBed, async, fakeAsync, tick, flush} from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ActionItemsComponent } from '../action-items/action-items.component';
import { Component } from '@angular/core';

const actionItemTextClass = '.action-item-text';
let compiled;
let fixture;
let isConfigured = false;
const mockConfig = {
  team: 'bros',
  teamId: '1010101',
  userName: 'dude bro',
  token: 'goober'
};

const componentElements = {
  actionItemLabelsList: () => { return compiled.querySelectorAll(actionItemTextClass); },
  actionItemLabels: (actionItemIndex: number) => { return componentElements.actionItemLabelsList()[actionItemIndex].textContent; },
  applicationTitle: () => { return compiled.querySelector('h1'); },
  teamName: () => { return compiled.querySelector('#teamUsingBoard').textContent; }
};

describe('App Component', () => {
    beforeEach(async(() => {
      compiled = createComponent();
    }));
    it('should render title', async(() => {
      expect(componentElements.applicationTitle().textContent).toContain('Action Item Dashboard');
    }));
});

function createComponent() {
  TestBed.configureTestingModule({
    declarations: [
      AppComponent,
      MockActionItemsComponent
    ]
  }).compileComponents();
  fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  return fixture.debugElement.nativeElement;
}


@Component({
  selector: 'mf-action-items',
  template: ''
})
class MockActionItemsComponent {}

