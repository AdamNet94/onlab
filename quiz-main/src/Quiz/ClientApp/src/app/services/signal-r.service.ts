import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Question } from '../models/question';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { HttpClient } from '@angular/common/http';
import { QuestionCrudService } from './question-crud.service';
import { AnswerSubmit } from '../models/answer-submit';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy {
  
  builder = new signalR.HubConnectionBuilder();
  readonly hubConnection:signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl('/quizhub').build();

  constructor() { }

  ngOnDestroy(): void {
    this.hubConnection.off("ReceiveQuizId");
    this.hubConnection.off("ShowQuestion");
    this.hubConnection.stop();
  }
  
    startConnection(pin:string,user:string) {
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))
    }

  joinGroup(pin:string,user:string,quiz:Quiz){
    try {
      this.hubConnection.invoke("JoinGroup", pin,user).then(()=> quiz.state=QuizState.CheckYourName)
      quiz.state=QuizState.CheckYourName;
    }catch (err) {
      console.error(err);
    }
  }

  addQuizIdListener(quiz:Quiz, nickName:string) {
    this.hubConnection.on('ReceiveQuizId', (id:number,question:Question) => {
      quiz.quizId = id;
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      this.hubConnection.invoke("CreatePlayer",id,nickName);
      console.log(id + " ez a quiz id");
      console.log(question);
    });
  }

  addQuestionListener(quiz:Quiz) {
    this.hubConnection.on('ShowQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      quiz.questionNumber++;
      console.log("az új kérdés: " + question.text);
    });
  }

  SendAnswer(submitAnswer:AnswerSubmit,quiz:Quiz) {
    try {
      this.hubConnection.invoke("SubmitAnswer", quiz.quizId,submitAnswer);
    }catch (err) {
      console.error(err);
    }
  }

  GetAnswerResult(quiz:Quiz, player:Player){
    try {
      this.hubConnection.invoke("GetAnswerScore", quiz.quizId).then(
        (answerScore) => 
       { 
         quiz.answerScore = answerScore;
        quiz.state=QuizState.AnswerSubmitted;
        player.totalScore+=answerScore;
       });
    }catch (err) {
      console.error(err);
    }
  }

}