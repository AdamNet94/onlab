import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Question } from '../models/question';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { HttpClient } from '@angular/common/http';
import { QuestionCrudService } from './question-crud.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  
  hubConnection:signalR.HubConnection=new signalR.HubConnectionBuilder()
  .withUrl('/quizhub',{ accessTokenFactory: () => "e7e18169-d6a8-4c80-9a4f-a13337d2f664"}).build();
  private header:string;
  constructor() { }
  //,{ accessTokenFactory: () => "e7e18169-d6a8-4c80-9a4f-a13337d2f664" } as signalR.IHttpConnectionOptions )
 /*{ accessTokenFactory: () => this.loginToken }*/
  
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

  addQuizIdListener(quiz:Quiz) {
    this.hubConnection.on('ReceiveQuizId', (id:number,question:Question) => {
      quiz.quizId = id;
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      console.log(id + " ez a quiz id");
      console.log(question);
    });
  }

  addQuestionListener(quiz:Quiz) {
    this.hubConnection.on('ShowQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      console.log("az új kérdés: " + question.text);
    });
  }

  SendAnswer(answerId:number,quiz:Quiz,nickName:string):Promise<void> {
    try {
      this.hubConnection.invoke("submitAnswer", quiz.quizId,answerId,nickName).then(
        (data)=> {
          // data first parameter is the correct answer Id, second is the score
        var result = data as number[];
        console.log(data);
        console.log("correct answer id from server is"+ result[0]);
        console.log("my Score is :"+ result[1]);
          quiz.answerScore=result[1];
          let correctAnswerId=result[0];
          quiz.currentQuestion.answers.forEach(element => {
            if(element.id==correctAnswerId)
               { element.isCorrect=true;}
          });
        });
        return new Promise(()=> {});
    }catch (err) {
      console.error(err);
    }
  }

}

export class CustomHttpClient extends signalR.HttpClient
{
  private autHeader:string;

  public send(request: signalR.HttpRequest): Promise<signalR.HttpResponse> {
    request.headers = {"Authorization": this.autHeader };
    // Now we have manipulated the request how we want we can just call the base class method
    return;
  }
    constructor(auth:string) {
        super(); 
        this.autHeader = auth;
    }


}
