import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestComponent } from './pull-request.component';
import {RageFaceComponent} from '../rage-face/rage-face.component';
import {PullRequest, VstsPullRequest} from '../../domain/action-item';

describe('PullRequestComponent', () => {
  let component: PullRequestComponent;
  let fixture: ComponentFixture<PullRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PullRequestComponent,
        RageFaceComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PullRequestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const prInfo = {
      repository: {
        name: 'testRepo'
      },
      title: 'testPr',
      creationDate: 1234567,
      pullRequestId: '123456',
      labels: []
    };
    component.pr = new VstsPullRequest(prInfo);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
