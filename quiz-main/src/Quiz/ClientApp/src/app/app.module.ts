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
import { QuestionCrudService } from './services/question-crud.service';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MyStudiorumComponent } from './my-studiorum/my-studiorum.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayComponent } from './play/play.component';
import { StudiorumCrudService } from './services/studiorum-crud.service';
import { LobbyComponent } from './lobby/lobby.component';
import { SignalRService } from './services/signal-r.service';
import { SignalAdminService } from './services/signal-admin.service';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



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
    MyStudiorumComponent,
    PlayComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: PlayComponent,pathMatch: 'full'},
      { path: 'question', component: QuestionComponent},
      { path: 'chart', component: ChartComponent},
      { path: 'stage', component: StageComponent },
      { path: 'question-editor', component: QuestionEditorComponent },
      { path: 'lobby/:studiorumId/:lobbyId', component: LobbyComponent },
      { path: 'my-studiorum/:studiorumId', component: QuestionListComponent,},
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'my-studiorum', component: MyStudiorumComponent, canActivate: [AuthorizeGuard]},
      { path: 'play', component: PlayComponent, canActivate: [AuthorizeGuard] }
    ]),
    ChartsModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    QuestionCrudService,
    StudiorumCrudService,
    SignalRService,
    SignalAdminService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
