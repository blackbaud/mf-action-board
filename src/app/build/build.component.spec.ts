import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildComponent } from './build.component';
import {RageFaceComponent} from '../rage-face/rage-face.component';
import {Build, VstsBuild} from '../../domain/action-item';

describe('BuildComponent', () => {
  let component: BuildComponent;
  let fixture: ComponentFixture<BuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BuildComponent,
        RageFaceComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const buildInfo = {
      definition: {
        name: 'testBuild'
      },
      finishTime: 1234567,
      id: '1234567',
    };
    component.build = new VstsBuild(buildInfo);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
