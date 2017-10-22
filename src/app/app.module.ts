import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ActionItemsComponent } from '../action-items/action-items.component';

import { JenkinsService } from '../jenkins/services/jenkins.service';
import { GithubService } from '../github/services/github.service';
import { VstsService } from '../github/services/vsts.service';
import { ConfigService } from '../config/config.service';
import { NotificationsService } from '../notifications/services/notifications.service';
import { PullRequestComponent } from './pull-request/pull-request.component';
import { RageFaceComponent } from './rage-face/rage-face.component';
import { BuildComponent } from './build/build.component';

@NgModule({
  declarations: [
    AppComponent,
    ActionItemsComponent,
    PullRequestComponent,
    RageFaceComponent,
    BuildComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [JenkinsService, GithubService, VstsService, ConfigService, NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
