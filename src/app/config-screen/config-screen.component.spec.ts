import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GithubConfig } from '../../domain/github-config';
import { VstsConfig } from '../../domain/vsts-config';
import { FakeConfigService } from '../../testing/fake-config.service';
import { ConfigService } from '../config.service';

import { ConfigScreenComponent } from './config-screen.component';
import { TEST_GITHUB_CONFIG, TEST_VSTS_CONFIG } from '../../testing/constants';

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
        {provide: GithubConfig, useValue: TEST_GITHUB_CONFIG},
        {provide: VstsConfig, useValue: TEST_VSTS_CONFIG},
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
