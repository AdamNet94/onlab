import { Component, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import { Answer } from '../models/answer';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { QuestionComponent } from '../question/question.component';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  private playerName: string = " ";
  private pin: number = 0;
  private quiz: Quiz;

  @ViewChild(QuestionComponent, { static: false }) questionChild;

  constructor(private SignalRconnection:SignalRService) {this.quiz = new Quiz();}

  ngOnInit() {
    this.SignalRconnection.startConnection(this.pin.toString(),this.playerName);
    this.SignalRconnection.addQuizIdListener(this.quiz);
    this.SignalRconnection.addQuestionListener(this.quiz);
  }

  onSubmit() {
    this.SignalRconnection.joinGroup(this.pin.toString(),this.playerName,this.quiz);
    this.quiz.state=QuizState.CheckYourName;
  }

  sendAnswer($event){
      this.questionChild.answersDisableFlag = true;
      let answerId:number = $event as number;
      this.SignalRconnection.SendAnswer(answerId,this.quiz);
      console.log(this.quiz.answerScore); this.quiz.state=QuizState.AnswerSubmitted;
  }
}
