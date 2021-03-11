import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../services/counter.service';
import { time } from 'console';
import { Question } from '../models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  
  @Input() public question:Question;
  timeleft = 10;
  constructor(private router: Router, private counter: CounterService) {}
   

  ngOnInit() {
    var cnt = this.timeleft;
    this.counter.CountDown(cnt);
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
}
