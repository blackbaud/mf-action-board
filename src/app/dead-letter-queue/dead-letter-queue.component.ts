import {ActionItemComponent} from '../action-item/action-item.component';
import {Component, Input} from '@angular/core';
import {DeadLetterQueue} from '../../domain/action-item';

@Component({
  selector: 'mf-dlq',
  templateUrl: './dead-letter-queue.component.html',
  styleUrls: ['./dead-letter-queue.component.css']
})
export class DeadLetterQueueComponent extends ActionItemComponent {
  @Input()
  dlq: DeadLetterQueue;

  get priorityClass(): String {
    return this.calcPriorityClass(this.dlq.priority);
  }
}
