import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { QuestionComponent } from './question/question.component';
import {ChartComponent} from './chart/chart.component';
import { StageComponent } from './stage/stage.component';
import { QuestionCrudService } from './shared/question-crud.service';
import { QuestionCreateComponent } from './question-create/question-create.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UsersComponent}  from './users/users.component';
import { LobbyComponent } from './lobby/lobby.component';
import { QuizUserComponent } from './quiz-user/quiz-user.component';
import { LoobyOutlookComponent } from './looby-outlook/looby-outlook.component';
import { MyStudiorumComponent } from './my-studiorum/my-studiorum.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    QuestionComponent,
    ChartComponent,
    StageComponent,
    QuestionCreateComponent,
    QuestionListComponent,
    QuestionEditComponent,
    LeaderboardComponent,
    UsersComponent,
    StageComponent,
    LobbyComponent,
    QuizUserComponent,
    LoobyOutlookComponent,
    MyStudiorumComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'question', component: QuestionComponent},
      { path: 'chart', component: ChartComponent},
      { path: 'stage', component: StageComponent },
      { path: 'question-create', component: QuestionCreateComponent },
      { path: 'question-edit', component: QuestionEditComponent },
      { path: 'question-list', component: QuestionListComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'lobby', component: LobbyComponent },
      { path: 'lobby-outlook', component: LoobyOutlookComponent },
      { path: 'quiz-user', component: QuizUserComponent },
      { path: 'my-studiorum', component: MyStudiorumComponent }
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
