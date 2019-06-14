import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollingService } from '../polling.service';

import { SprintLitComponent } from './sprint-lit.component';

describe('SprintLitComponent', () => {
  let component: SprintLitComponent;
  let fixture: ComponentFixture<SprintLitComponent>;
  const doNothingPollingService = {
    startPoll: (interval: number, func: () => void) => {
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintLitComponent ],
      providers: [{provide: PollingService, useValue: doNothingPollingService}]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintLitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.litImage).toBeDefined();
  });
});
