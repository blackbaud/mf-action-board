import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VstsBuild } from '../../domain/action-item';
import { RageFaceComponent } from '../rage-face/rage-face.component';

import { BuildComponent } from './build.component';

describe('BuildComponent', () => {
  let component: BuildComponent;
  let fixture: ComponentFixture<BuildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BuildComponent,
        RageFaceComponent
      ]
    });
  });

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
