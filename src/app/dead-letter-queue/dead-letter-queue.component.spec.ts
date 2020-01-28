import {DeadLetterQueueComponent} from './dead-letter-queue.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RageFaceComponent} from '../rage-face/rage-face.component';
import {DeadLetterQueue} from '../../domain/action-item';
import {PRIORITY} from '../app.constants';

describe('DeadLetterQueueComponent', () => {
  let component: DeadLetterQueueComponent;
  let fixture: ComponentFixture<DeadLetterQueueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeadLetterQueueComponent,
        RageFaceComponent
      ]
    });

    fixture = TestBed.createComponent(DeadLetterQueueComponent);
    component = fixture.componentInstance;
  });

  [
    { call_failed: true, expected_priority: PRIORITY.GREY },
    { call_failed: false, expected_priority: PRIORITY.RED }
  ].forEach((inputs) => {
    it('should create a dead letter queue item appropriately', () => {
      const report = {
        service: 'my service',
        scs: 'my scs',
        zone: 'my zone',
        populated: true,
        call_failed: inputs.call_failed,
        url: 'data that does not matter here'
      };

      component.dlq = new DeadLetterQueue(report);

      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.priorityClass).toBe(inputs.expected_priority);
    });
  });
});
