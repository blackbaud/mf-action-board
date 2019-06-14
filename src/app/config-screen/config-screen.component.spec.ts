import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GithubConfig } from '../../domain/github-config';
import { VstsConfig } from '../../domain/vsts-config';
import { FakeConfigService } from '../../testing/fake-config.service';
import { ConfigService } from '../config.service';

import { ConfigScreenComponent } from './config-screen.component';

// TODO put the common test configs in a common place
const githubConfig: GithubConfig = {
  team: 'bros',
  teamId: '1010101',
  userName: 'dude bro',
  token: 'goober',
  watchList: '',
  isConfigured: () => true
};

const vstsConfig: VstsConfig = {
  team: 'bros',
  token: 'token',
  username: 'dude bro',
  isConfigured: () => true
};

describe('ConfigScreenComponent', () => {
  let component: ConfigScreenComponent;
  let fixture: ComponentFixture<ConfigScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        {provide: GithubConfig, useValue: githubConfig},
        {provide: VstsConfig, useValue: vstsConfig},
        {provide: ConfigService, useClass: FakeConfigService}
      ],
      declarations: [ConfigScreenComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
