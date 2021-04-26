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
        .catch(err => console.log('Error while starting connection: ' + err)).then(()=> this.joinGroupAdmin(pin,user))
    }

  addRenderNewPlayerListener(users:Array<string>){
    this.hubConnection.on("RenderNewPlayer", (newUser) => {
      users.push(newUser);
      console.log(newUser);
    })
  }

  addReceiveFinalResults(quiz:Quiz){
    this.hubConnection.on("ReceiveAnswerResults", (players:Array<Player>,isFinal:boolean) => {
      console.log("topplayer from server: ");
      var playersServer = players as Array<Player>;
      quiz.topPlayers = [];
      console.log(players.length);
      playersServer.forEach( element =>
        {
        console.log(element);
        var topPlayer:Player = new Player(element.nickName,element.totalScore);
        quiz.topPlayers.push(topPlayer);
        });
      console.log("in quiz.topplayer: " +quiz.topPlayers[0].nickName);
      quiz.state= isFinal ? QuizState.FinalResult: QuizState.ShowScoreBoard;
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
    })
  }

  startGame(studiorumid:number,quizPin:string) {
    try {
      this.hubConnection.invoke("StartGame",studiorumid,quizPin);
    }
    catch(err){
      console.error(err);
    }
  }

  getCurrentQuestionTopPlayers(quiz:Quiz) {
    this.hubConnection.invoke("CurrentQuestionTopPlayers",quiz.quizId).then(
      (topPlayers:Array<Player>) => {
        quiz.topPlayers = topPlayers;
      }
    );
  }

  addAnswerCountDecresedListener(quiz:Quiz){
    this.hubConnection.on("AnswerCountDecresed", () =>{
      quiz.answerArrived++;
    })
  }

  skipQuestion(pin:string) {
    try {
      this.hubConnection.invoke("SkipQuestionOnPlayers", pin);
    }catch (err) {
      console.error(err);
    }
  }

  joinGroupAdmin(pin:string,user:string){
    try {
      this.hubConnection.invoke("JoinGroupAdmin", pin,user);
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
