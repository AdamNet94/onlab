import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Question } from '../models/question';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl('/quizhub').build();

    startConnection(pin:string,user:string){
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

  AddQuizIdListener(quiz:Quiz) {
    this.hubConnection.on('ReceiveQuizId', (id:number,question:Question) => {
      quiz.quizId = id;
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      console.log(id + " ez a quiz id");
      console.log(question);
    });
  }

  AddQuestionListener(quiz:Quiz) {
    this.hubConnection.on('ShowQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      console.log("az új kérdés: " + question.text);

    });
  }

}
