import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { QuestionComponent } from './question/question.component';
import {ChartComponent} from './chart/chart.component';
import { StageComponent } from './stage/stage.component';
import { QuestionCrudService } from './shared/question-crud.service';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LoobyOutlookComponent } from './looby-outlook/looby-outlook.component';
import { MyStudiorumComponent } from './my-studiorum/my-studiorum.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayComponent } from './play/play.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    QuestionComponent,
    ChartComponent,
    StageComponent,
    QuestionEditorComponent,
    QuestionListComponent,
    LeaderboardComponent,
    StageComponent,
    LobbyComponent,
    LoobyOutlookComponent,
    MyStudiorumComponent,
    PlayComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: PlayComponent, pathMatch: 'full' },
      { path: 'question', component: QuestionComponent},
      { path: 'chart', component: ChartComponent},
      { path: 'stage', component: StageComponent },
      { path: 'question-editor', component: QuestionEditorComponent },
      { path: 'question-list', component: QuestionListComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'lobby', component: LobbyComponent },
      { path: 'lobby-outlook', component: LoobyOutlookComponent },
      { path: 'my-studiorum', component: MyStudiorumComponent },
      { path: 'play', component: PlayComponent }
    ]),
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    QuestionCrudService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
