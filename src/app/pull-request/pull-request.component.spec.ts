import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VstsPullRequest } from '../../domain/action-item';
import { RageFaceComponent } from '../rage-face/rage-face.component';

import { PullRequestComponent } from './pull-request.component';

describe('PullRequestComponent', () => {
  let component: PullRequestComponent;
  let fixture: ComponentFixture<PullRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PullRequestComponent,
        RageFaceComponent
      ]
    });
  });

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
