import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild(QuestionComponent, { static: false }) questionChild;
  @ViewChild(ChartComponent, { static: false }) chartChild;

  constructor(private route:ActivatedRoute, private signalAdminConnection :SignalAdminService) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    this.quizPin = String(route.snapshot.paramMap.get('lobbyId'));
    this.route.queryParams.subscribe(params => {
      this.questionCount = params['questionCount'];
    });
    console.log("query param question count = "+ this.questionCount);
  }

  ngOnInit() {
    this.signalAdminConnection.addQuizIdListener(this.quiz,"admin"+this.quizPin);
    this.signalAdminConnection.addRenderNewPlayerListener(this.players);
    this.signalAdminConnection.addReceiveCorrectAnswerListener(this.quiz,this.chartData);
    this.signalAdminConnection.addQuestionListener(this.quiz);
    this.signalAdminConnection.addReceiveFinalResults(this.quiz);
    this.signalAdminConnection.startConnectionAdmin(this.quizPin.toString(),"admin"+this.quizPin.toString());
    console.log(this.players);
  }

  onStart(){
    this.signalAdminConnection.startGame(this.studiorumId,this.quizPin.toString());
  }

  refreshChart(){
    console.log(this.chartData);
    this.chartChild.data=this.chartData;
      this.chartChild.refreshChart();
    console.log("chartdata refreshed");
  }

  Next(){
    this.signalAdminConnection.Next(this.quiz.quizId,this.quizPin);
  }
}
