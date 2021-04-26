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
import { PlayComponent } from '../play/play.component';

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
      this.hubConnection.invoke("JoinGroup", pin,user).then(
        (isTakenFromServer:boolean) => 
        {
         quiz.nameIsTaken = isTakenFromServer;
         if(!isTakenFromServer)
          {
            
            quiz.state=QuizState.CheckYourName;
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  addQuizIdListener(quiz:Quiz, nickName:string,pin:string) {
    this.hubConnection.on('ReceiveQuizId', (id:number) => {
      quiz.quizId = id;
      console.log(id + " ez a quiz id");
    });
  }

  addPreviewQuestionListener(quiz:Quiz){
    this.hubConnection.on('PreviewQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      quiz.questionNumber++;
      console.log("Kérdés Preview meghívva: " + question.text);
      console.log("a válaszok: " + question.answers);
    });
  }

  addQuestionListener(quiz:Quiz) {
    this.hubConnection.on('ShowQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      console.log("ShowQuestion meghívva a teljes válaszokkal");
      console.log(question.text);
      console.log(question.answers);
    });
  }

  addSkipQuestionListener(playComponent:PlayComponent,quiz:Quiz,palyer:Player) {
    this.hubConnection.on('SkipQuestion', () => {
      if(playComponent.questionChild)
        playComponent.questionChild.timeleft=0;
        this.GetAnswerResult(quiz,palyer);
    });
  }

  SendAnswer(submitAnswer:AnswerSubmit,quiz:Quiz,pin:string) {
    try {
      this.hubConnection.invoke("SubmitAnswer", quiz.quizId,submitAnswer,pin);
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