import { PRIORITY } from '../app.constants';
import * as moment from 'moment';
import { ACTION_PRIORITY_IGNORE, ACTION_PRIORITY_NEW, ACTION_PRIORITY_NOW, ACTION_PRIORITY_SOON } from '../../domain/action-item';

export class ActionItemComponent {
  calcPriorityClass(priority: number): String {
    switch (priority) {
      case ACTION_PRIORITY_NOW: {
        return PRIORITY.RED;
      }
      case ACTION_PRIORITY_SOON: {
        return PRIORITY.ORANGE;
      }
      case ACTION_PRIORITY_NEW: {
        return PRIORITY.YELLOW;
      }
      case ACTION_PRIORITY_IGNORE: {
        return PRIORITY.GREY;
      }
      default: {
        return '';
      }
    }
  }

  getTimeElapsed(time) {
    return moment(time).fromNow();
  }
}
