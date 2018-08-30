import { Component } from '@angular/core';
import { PollingService } from '../polling.service';
import { SPRINT_LIT_REFRESH_INTERVAL_IN_MS } from "../app.constants";

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
    this.pollingService.startPoll(SPRINT_LIT_REFRESH_INTERVAL_IN_MS, this.setLitImage);
  }

  setLitImage = (): void => {
    this.litImage = this.litImages[Math.floor(Math.random() * this.litImages.length)];
  }
}
