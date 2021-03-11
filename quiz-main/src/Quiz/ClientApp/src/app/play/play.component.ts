import { Component, OnInit } from '@angular/core';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  private playerName: string = "";
  private pin: number = 0;
  private quiz: Quiz;

  constructor(private SignalRconnection:SignalRService) {this.quiz = new Quiz();}

  ngOnInit() {
    this.SignalRconnection.startConnection(this.pin.toString(),this.playerName);
    this.SignalRconnection.AddQuizIdListener(this.quiz);
  }

  onSubmit(){
    this.SignalRconnection.joinGroup(this.pin.toString(),this.playerName,this.quiz);
    this.quiz.state=QuizState.CheckYourName;
  }

}
