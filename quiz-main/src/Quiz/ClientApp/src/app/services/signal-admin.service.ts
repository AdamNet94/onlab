import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Answer } from '../models/answer';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { SignalRService } from './signal-r.service';


@Injectable({
  providedIn: 'root'
})
export class SignalAdminService extends SignalRService {

  constructor() {
    super();
  }

  startConnectionAdmin(pin:string,user:string){      
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err)).then(()=> this.joinGroup(pin,user))
    }

  addRenderNewPlayerListener(users:Array<string>){
    this.hubConnection.on("RenderNewPlayer", (newUser) =>{
      users.push(newUser);
      console.log(newUser);
    })
  }

  addReceiveCorrectAnswerListener(quiz:Quiz){
    this.hubConnection.on("ReceiveCorrectAnswer", (answer:Answer) =>{
      quiz.correctAnswer=answer;
      quiz.state=QuizState.ShowCorrectAnswer;
    })
  }

  startGame(studiorumid:number,quizpin:string){
    this.hubConnection.invoke("StartGame",studiorumid,quizpin);
  }

  joinGroup(pin:string,user:string){
    try {
      this.hubConnection.invoke("JoinGroup", pin,user);
    }catch (err) {
      console.error(err);
    }
  }

  Next(quizId:number,pin:string){
    try {
      this.hubConnection.invoke("Next", quizId,pin);
    }catch (err) {
      console.error(err);
    }
  }

}
