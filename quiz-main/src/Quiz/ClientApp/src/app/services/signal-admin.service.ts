import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { LobbyComponent } from '../lobby/lobby.component';
import { Answer } from '../models/answer';
import { AnswerStats } from '../models/AnswerStats';
import { Player } from '../models/player';
import { Question } from '../models/question';
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

  startConnectionAdmin(studiorumId:number,pin:string,quizTime:number,quiz:Quiz){
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))
        .then(()=> this.joinGroupAdmin(studiorumId,pin,quizTime,quiz))
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

  addQuestionAdminListener(quiz:Quiz,lobbyComponent: LobbyComponent) {
    this.hubConnection.on('ShowQuestion', (question:Question) => {
      quiz.currentQuestion = question as Question;
      quiz.state = QuizState.Question;
      quiz.timeRemained = quiz.quetionTime;
      lobbyComponent.CountDown(lobbyComponent);
      console.log("ShowQuestion meghívva a teljes válaszokkal");
      console.log(question.text);
      console.log(question.answers);
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

  StartCounting(quizId:number) {
   this.hubConnection.invoke("CountDown", quizId);
  }
  
  skipQuestion(pin:string) {
    try {
      this.hubConnection.invoke("SkipQuestionOnPlayers", pin);
    } catch (err) {
      console.error(err);
    }
  }

  joinGroupAdmin(studiorumId:number,pin:string,quizTime:number,quiz:Quiz){
    try {
      this.hubConnection.invoke("JoinGroupAdmin",studiorumId,pin,quizTime).then(
        (quizId:number) =>{
          quiz.quizId = quizId;
        }
        );
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
