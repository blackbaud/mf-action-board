import { Component } from '@angular/core';
import { PollingService } from '../polling.service';

@Component({
  selector: 'mf-sprint-lit',
  templateUrl: './sprint-lit.component.html',
  styleUrls: ['./sprint-lit.component.css']
})

export class SprintLitComponent {

  litImage: string;
  litImages: Array<string> = [
    "../assets/ethanLIT.gif",
    "../assets/carolineLIT.jpg"
  ];

  constructor(private pollingService: PollingService) {
    this.setLitImage();
    this.pollingService.startPoll(5000, this.setLitImage);
  }

  setLitImage = (): void => {
    this.litImage = this.litImages[Math.floor(Math.random() * this.litImages.length)];
  }
}
