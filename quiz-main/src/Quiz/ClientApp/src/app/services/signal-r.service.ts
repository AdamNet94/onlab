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
import { QuestionComponent } from '../question/question.component';

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
        (quizId:number) => 
        {
          //if it returns a a -1 a a quizID it means the name was taken already if it turns the real quizID
          // then it created the player
         if (quizId < 0)
         {
            quiz.nameIsTaken = true;
         }
          else {
            quiz.nameIsTaken = false;
            quiz.quizId = quizId;
            console.log("a quiz-state a joinGroup visszatérése után"+ quiz.state);
            quiz.state = quiz.state == QuizState.Question ? QuizState.Question: QuizState.CheckYourName;
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  addPreviewQuestionListener(quiz:Quiz){
    this.hubConnection.on('PreviewQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      quiz.questionNumber++;
      quiz.answerArrived=0;
      console.log("Kérdés Preview meghívva: " + question.text);
      console.log("a válaszok: " + question.answers);
    });
  }


  addQuestionListener(quiz:Quiz) {
    this.hubConnection.on('ShowQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      quiz.answerArrived = 0;
      console.log("ShowQuestion meghívva a teljes válaszokkal");
      console.log(question.text);
      console.log(question.answers);
    });
  }

  addSkipQuestionListener(child:QuestionComponent,quiz:Quiz,player:Player) {
    this.hubConnection.on('SkipQuestion', () => {
     child.answersDisableFlag=true;
     this.getAnswerResult(quiz,player);
     console.log();
     ("SKI CALLED, DISABLE FLAG IS  =TRUE");
    });
  }

  SendAnswer(answerId:number,quiz:Quiz,pin:string) {
    try {
      this.hubConnection.invoke("SubmitAnswer", quiz.quizId,answerId,pin);
    }catch (err) {
      console.error(err);
    }
  }
  

  addAnswerResultListener(quiz:Quiz, player:Player){
    try {
      this.hubConnection.on('InvokeGetAnswer', () => {
        this.getAnswerResult(quiz,player);
      });
    }catch (err) {
      console.error(err);
    }
  }

  getAnswerResult(quiz:Quiz, player:Player){
      this.hubConnection.invoke("GetAnswerScore", quiz.quizId).then(
        (answerScore) => 
      { 
        quiz.answerScore = answerScore;
        quiz.state=QuizState.AnswerSubmitted;
        player.totalScore+=answerScore;
      });
  }

}