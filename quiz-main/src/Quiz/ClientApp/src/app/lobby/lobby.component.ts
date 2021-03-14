import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild(QuestionComponent, { static: false }) questionChild;
  
  constructor(private route:ActivatedRoute, private signalAdminConnection :SignalAdminService) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    this.quizPin = String(route.snapshot.paramMap.get('lobbyId'));
  }

  ngOnInit() {
    this.signalAdminConnection.addQuizIdListener(this.quiz);
    this.signalAdminConnection.addRenderNewPlayerListener(this.players);
    this.signalAdminConnection.addReceiveCorrectAnswerListener(this.quiz);
    this.signalAdminConnection.addQuestionListener(this.quiz);
    this.signalAdminConnection.startConnectionAdmin(this.quizPin.toString(),"admin"+this.quizPin.toString());
    console.log(this.players);
  }

  onStart(){
    this.signalAdminConnection.startGame(1,this.quizPin.toString());
  }

  Next(){
    this.signalAdminConnection.Next(this.quiz.quizId,this.quizPin);
    console.log(this.quiz.correctAnswer.text);
    /*if(this.quiz.state == QuizState.ShowCorrectAnswer)
      {
        if(this.quiz.correctAnswer.id > 0 )
          console.log(this.quiz.correctAnswer.text);
      }*/
  }

}
