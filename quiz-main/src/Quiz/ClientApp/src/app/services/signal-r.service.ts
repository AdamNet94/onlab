import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Question } from '../models/question';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  loginToken;
  constructor() {}; 
  //,{ accessTokenFactory: () => this.loginToken })
 /**/
  hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl('/quizhub', { accessTokenFactory: () => this.loginToken }
  ).build();
  
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

  SendAnswer(answerId:number, quiz:Quiz):Promise<void> {
    try {
      this.hubConnection.invoke("submitAnswer", quiz.quizId,answerId).then(
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
               { quiz.correctAnswer=element;}
          });
        });
        return new Promise(()=> {});
    }catch (err) {
      console.error(err);
    }
  }

}
