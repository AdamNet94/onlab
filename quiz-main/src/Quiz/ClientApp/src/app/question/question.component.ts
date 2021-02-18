import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  timeLeft: number = 5;
  timer: string;
  interval;

  startTimer(): void {
    var minutes: number;
    var seconds: number;

    minutes = Math.floor(this.timeLeft / 60);
    seconds = this.timeLeft % 60;

    this.timer = minutes < 10 ? this.timer = "0" + minutes.toString() : this.timer = minutes.toString();
    this.timer = seconds < 10 ? this.timer += ":0" + seconds.toString() : this.timer += ":" + seconds.toString();

    if (this.timeLeft > 0) {
      this.timeLeft--;
    }
    else {
      //this.router.navigate(['/chart']);
      this.answersDisabled();
    }

    this.interval = setInterval(() => {
  
      minutes = Math.floor(this.timeLeft / 60);
      seconds = this.timeLeft % 60;
  
      this.timer = minutes < 10 ? this.timer = "0" + minutes.toString() : this.timer = minutes.toString();
      this.timer = seconds < 10 ? this.timer += ":0" + seconds.toString() : this.timer += ":" + seconds.toString();
  
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        //this.router.navigate(['/chart']);
        this.answersDisabled();
      }
    }, 1000);
  }

  pauseTimer(): void {
    clearInterval(this.interval);
  }

  answersDisabled() {
    const ids: string[] = ["answerA", "answerB", "answerC", "answerD"];
    let answer;
    for (let id of ids) {
        answer = <HTMLInputElement>document.getElementById(id);
        answer.classList.remove('answer');
        answer.classList.add('answer-disabled');
        answer.disabled = true;
    }
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

  constructor(private router: Router) { }

  ngOnInit() {
    this.startTimer();
  }


}
