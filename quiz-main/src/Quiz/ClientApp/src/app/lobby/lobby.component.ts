import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { HubBuilderService } from '../services/hub-builder.service';
import { Answer } from '../shared/answer';
import { Question } from '../shared/question';
import { abort } from 'process';
import { HttpClient } from '@angular/common/http';
import { QuestionCrudService } from '../shared/question-crud.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  users: string[];

  currentQuestion: Question;
  currentAnswers: Answer[];
  QuizId: number;

  connection: signalR.HubConnection;

  constructor(private service: QuestionCrudService, hubBuilder: HubBuilderService, private router: Router) {

    this.connection = hubBuilder.getConnection();
    

    this.connection.on("ShowQuestion", q => this.ShowQuestion(q));
    this.connection.on("ShowAnswer", (answer, user) => this.showAnswer(answer, user));
    this.connection.on("ShowResults", () => this.showQuizResults());
  }
  ngOnInit(): void {

    this.connection.start();
    this.service.getQuizInstanceId().subscribe(resp => {
      this.QuizId = resp;
    },
      error => {
        console.error(error)
      },
      () =>  this.nextQuestion());
    
  }

  nextQuestion() {
    this.service.quizNext(this.QuizId).subscribe(resp => {
      this.currentQuestion = resp;
    });
  }

  ShowQuestion(newQuestion: Question) {
    console.log("client.showQuestion Called");
  const ids: string[] = ["answerA", "answerB", "answerC", "answerD"];
  this.currentQuestion= newQuestion;
  console.log(this.currentQuestion.text);
  console.log(this.currentQuestion.answers[1]);

    let answer;
    for (let id of ids) {
      answer = <HTMLInputElement>document.getElementById(id);
      answer.classList.remove('answer-selected');
      answer.classList.add('answer');
      answer.disabled = false;
    }
  }

  showAnswer(answer: string, user: string) {
      
  }

  showQuizResults() {
    this.router.navigate(['/stage']);
  }

  userJoined(username: string) {
    this.users.push(username);
  }

  answerSelected(event: Event): void {
    const ids: string[] = ["answerA", "answerB", "answerC", "answerD"];
    const elementId: string = (event.target as Element).id;
    let answer;
    for (let id of ids) {
      if (id == elementId) {
        answer = <HTMLInputElement>document.getElementById(id);
        answer.classList.remove('answer');
        answer.classList.add('answer-selected');
        answer.disabled = true;
      } else {
        answer = <HTMLInputElement>document.getElementById(id);
        answer.classList.remove('answer');
        answer.classList.add('answer-disabled');
        answer.disabled = true;
      }
    }

  }
}
