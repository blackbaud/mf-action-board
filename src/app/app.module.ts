import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { JenkinsService } from './shared/services/jenkins.service';
import { GithubService } from '../github/services/github.service';
import { VstsService } from '../github/services/vsts.service';
import { ConfigService } from './config.service';
import { RefreshService } from './refresh.service';
import { NotificationsService } from '../notifications/services/notifications.service';
import { PullRequestComponent } from './pull-request/pull-request.component';
import { RageFaceComponent } from './rage-face/rage-face.component';
import { BuildComponent } from './build/build.component';
import { ConfigScreenComponent } from './config-screen/config-screen.component';
import { AppRoutingModule } from './app-routing.module';
import { SprintLitComponent } from './sprint-lit/sprint-lit.component';
import { ActionListComponent } from './action-list/action-list.component';
import { PollingService } from './polling.service';
import { DeadLetterQueueService } from '../github/services/dead-letter-queue.service';
import { DeadLetterQueueComponent } from './dead-letter-queue/dead-letter-queue.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ActionListComponent,
    AppComponent,
    BuildComponent,
    ConfigScreenComponent,
    DeadLetterQueueComponent,
    PullRequestComponent,
    RageFaceComponent,
    SprintLitComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
    DeadLetterQueueService,
    GithubService,
    JenkinsService,
    NotificationsService,
    PollingService,
    RefreshService,
    VstsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
