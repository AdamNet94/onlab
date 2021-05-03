import { Component, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Answer } from '../models/answer';
import { AnswerSubmit } from '../models/answer-submit';
import { Player } from '../models/player';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { QuestionComponent } from '../question/question.component';
import { SignalRService } from '../services/signal-r.service';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {

  private player:Player = new Player("",0);
  private pin: number = 0;
  private quiz: Quiz;

  @ViewChild(QuestionComponent, { static: false }) questionChild:QuestionComponent;

  constructor(private SignalRconnection:SignalRService) {this.quiz = new Quiz();}

  ngOnInit() {
   this.SignalRconnection.startConnection(this.pin.toString(),this.player.nickName);
   this.SignalRconnection.addQuestionListener(this.quiz);
   this.SignalRconnection.addAnswerResultListener(this.quiz,this.player);
   this.SignalRconnection.addPreviewQuestionListener(this.quiz);
   this.SignalRconnection.addSkipQuestionListener(this.questionChild,this.quiz,this.player);
  }

  onSubmit() {
    this.SignalRconnection.joinGroup(this.pin.toString(),this.player.nickName,this.quiz);
  }

  sendAnswer($event) {
      this.questionChild.answersDisableFlag = true;
      let answerSubmit:number = $event as number;
      this.SignalRconnection.SendAnswer(answerSubmit,this.quiz,this.pin.toString());
  }

  ngOnDestroy(): void {
    this.SignalRconnection.hubConnection.off("ShowQuestion");
    this.SignalRconnection.hubConnection.off("SkipQuestion");
    this.SignalRconnection.hubConnection.stop().then(() => console.log("on destroyed called and conenction stopped"));
  }

}
