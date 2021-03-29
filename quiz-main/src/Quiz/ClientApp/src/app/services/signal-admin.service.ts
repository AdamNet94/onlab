import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Answer } from '../models/answer';
import { AnswerStats } from '../models/AnswerStats';
import { Player } from '../models/player';
import { Quiz } from '../models/quiz';
import { QuizState } from '../models/quiz-state';
import { QuestionCrudService } from './question-crud.service';
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
    this.hubConnection.on("RenderNewPlayer", (newUser) => {
      users.push(newUser);
      console.log(newUser);
    })
  }

  addReceiveFinalResults(quiz:Quiz){
    this.hubConnection.on("ReceiveFinalResults", (players:Array<Player>) => {
      console.log("topplayer from server: ");
      var playersServer = players as Array<Player>;
      console.log(players.length);
      playersServer.forEach( element =>
        {
          console.log(element);
        var topPlayer:Player = new Player(element.nickName,element.totalScore);
        quiz.topPlayers.push(topPlayer);
        });
      console.log("in quiz.topplayer: " +quiz.topPlayers[0].nickName);
      quiz.state=QuizState.FinalResult;
    });
  }

  addReceiveCorrectAnswerListener(quiz:Quiz, chartData:Array<AnswerStats>){
    this.hubConnection.on("ReceiveCorrectAnswer", (answer:Answer,stats:Array<AnswerStats>) =>{
      chartData.splice(0,chartData.length);
      stats.forEach( element =>
        chartData.push(element)
      );
      quiz.currentQuestion.answers.find(a => a.id == answer.id).isCorrect=true;
      quiz.state=QuizState.ShowCorrectAnswer;
      console.log(quiz.answerFromServer);
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
