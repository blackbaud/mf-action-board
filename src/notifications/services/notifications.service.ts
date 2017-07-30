import { Injectable } from '@angular/core';
import { ActionItem } from '../../domain/action-item';

@Injectable()
export class NotificationsService {
  public setUpNoties() {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        const notification = new Notification('Welcome to MF Action Board!', {
          dir: 'auto',
          lang: 'en',
          icon: '../assets/angular-logo.png'
        });
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    });
  }

  public notifyNewActionItems(newActionItems: ActionItem[]): void {
    newActionItems.forEach((actionItem) => {
      this.notify(actionItem);
    });
  }

  public notify(actionItem: ActionItem): void {
    const options = { dir: 'auto', lang: 'en' };
    if (actionItem.source === 'github') {
      options['icon'] = '../assets/pull-request.png';
    } else if (actionItem.source === 'jenkins') {
      options['icon'] = '../assets/jenkins-failed-build-icon.png';
    }
    const notification = new Notification(actionItem.name, options);
    setTimeout(() => {
      notification.close();
    }, 5000);
    notification.onclick = (event) => {
      event.preventDefault();
      window.open(actionItem.url, '_blank');
    };
  }
}
