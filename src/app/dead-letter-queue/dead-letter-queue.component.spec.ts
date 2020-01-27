import {DeadLetterQueueComponent} from './dead-letter-queue.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RageFaceComponent} from '../rage-face/rage-face.component';
import {DeadLetterQueue} from '../../domain/action-item';

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

  it('should create a dead letter queue item', () => {
    const report = {
      service: 'my service',
      scs: 'my scs',
      zone: 'my zone',
      populated: true
    };

    component.dlq = new DeadLetterQueue(report);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
