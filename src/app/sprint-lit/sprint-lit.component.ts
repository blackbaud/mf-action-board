import { Component } from '@angular/core';

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

  constructor() {
    this.setLitImage();
  }

  private setLitImage() {
    this.litImage = this.litImages[Math.floor(Math.random() * this.litImages.length)];
  }
}
