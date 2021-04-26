import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { ChartComponent } from '../chart/chart.component';
import { AnswerStats } from '../models/AnswerStats';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { QuestionComponent } from '../question/question.component';
import { SignalAdminService } from '../services/signal-admin.service';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  studiorumId:number;
  quizPin:string;
  players:Array<string> = new Array<string>();
  quiz:Quiz=new Quiz();
  chartData:Array<AnswerStats> = Array<AnswerStats>();
  questionCount:number;


  @ViewChild(QuestionComponent, { static: false }) questionChild:QuestionComponent;
  @ViewChild(ChartComponent, { static: false }) chartChild;

  constructor(private route:ActivatedRoute, private signalAdminConnection :SignalAdminService) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    this.quizPin= String(route.snapshot.paramMap.get('lobbyId'));
    this.route.queryParams.subscribe(params => {
      this.questionCount = params['questionCount'];
    });
    console.log("query param question count = "+ this.questionCount);
  }

  ngOnInit() {
    this.signalAdminConnection.addQuizIdListener(this.quiz,"admin"+this.quizPin,this.quizPin);
    this.signalAdminConnection.addRenderNewPlayerListener(this.players);
    this.signalAdminConnection.addReceiveCorrectAnswerListener(this.quiz,this.chartData);
    this.signalAdminConnection.addQuestionListener(this.quiz);
    this.signalAdminConnection.addReceiveFinalResults(this.quiz);
    this.signalAdminConnection.addAnswerCountDecresedListener(this.quiz);
    this.signalAdminConnection.startConnectionAdmin(this.quizPin,"admin"+this.quizPin);
    this.signalAdminConnection.addPreviewQuestionListener(this.quiz);
  }

  skip() {
    this.questionChild.timeleft = 0;
    this.signalAdminConnection.skipQuestion(this.quizPin);
    this.next();
    
  }

  onStart(){
    this.signalAdminConnection.startGame(this.studiorumId,this.quizPin);
    console.log("starting the game");
  }

  refreshChart() {
    console.log(this.chartData);
    this.chartChild.data=this.chartData;
    this.chartChild.refreshChart();
    console.log("chartdata refreshed");
  }

  next() {
    this.signalAdminConnection.Next(this.quiz.quizId,this.quizPin);
    this.quiz.answerArrived = 0;
  }

  ngOnDestroy(): void {
    this.signalAdminConnection.hubConnection.off("ReceiveQuizId");
    this.signalAdminConnection.hubConnection.off("ShowQuestion");
    this.signalAdminConnection.hubConnection.off("RenderNewPlayer");
    this.signalAdminConnection.hubConnection.off("ReceiveAnswerResults");
    this.signalAdminConnection.hubConnection.off("ReceiveCorrectAnswer");
    this.signalAdminConnection.hubConnection.off("AnswerCountDecresed");
    this.signalAdminConnection.hubConnection.stop().then(() => console.log("on destroyed called and conenction stopped"));
  }

}
