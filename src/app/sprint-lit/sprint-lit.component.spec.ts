import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintLitComponent } from './sprint-lit.component';
import {PollingService} from '../polling.service';

describe('SprintLitComponent', () => {
  let component: SprintLitComponent;
  let fixture: ComponentFixture<SprintLitComponent>;
  const doNothingPollingService = {
    startPoll: (interval: number, func: () => void) => {
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintLitComponent ],
      providers: [{provide: PollingService, useValue: doNothingPollingService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintLitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.litImage).not.toBeUndefined();
  });
});
