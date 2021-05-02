import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent } from '../chart/chart.component';
import { AnswerStats } from '../models/AnswerStats';
import { Quiz } from '../models/quiz';
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
    //this.signalAdminConnection.addQuestionListener(this.quiz);
    this.signalAdminConnection.addReceiveFinalResults(this.quiz);
    this.signalAdminConnection.startConnectionAdmin(this.studiorumId,this.quizPin,this.quiz.quetionTime,this.quiz);
    this.signalAdminConnection.addPreviewQuestionListener(this.quiz);
    this.signalAdminConnection.addAnswerCountDecresedListener(this.quiz);
    this.signalAdminConnection.addQuestionAdminListener(this.quiz,this);
  }

  skip() {
    this.quiz.timeRemained = 0;
    this.signalAdminConnection.skipQuestion(this.quizPin);
    this.next();
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

  CountDown(lc:LobbyComponent) {
    var counter = setInterval(Counting, 1000);
    function Counting()
      {
        if (lc.quiz.timeRemained == 0 || lc.quiz.timeRemained < 0 )
         {
           clearInterval(counter);
           lc.next();
         }
        else {
          lc.quiz.timeRemained-=1;
          lc.signalAdminConnection.StartCounting(lc.quiz.quizId);
          console.log("contDown called");
        }
    }
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
