import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../services/counter.service';
import { Question } from '../models/question';
import { QuizState } from '../models/quiz-state';
import { Answer } from '../models/answer';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  
  @Input() public question:Question;
  @Input() public answerFromServer:Answer;
  readonly initTime = 15;
  timeleft = this.initTime;
  answersDisableFlag:boolean = false;
  @Output() answerSubmittedEvent = new EventEmitter<number>();
  @Output() timeIsUpEvent = new EventEmitter<QuizState>();


  constructor(private router: Router) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'question': {
            this.NextQuestion(changes.question.currentValue)
          }
        }
      }
    }
  }
  
  submitAnswer(index:number){
      this.answerSubmittedEvent.emit(this.question.answers[index].id);
  }

  NextQuestion(nextQuestion:Question){
    this.question = nextQuestion;
    this.answersDisableFlag= false;
    this.timeleft=this.initTime;
    this.CountDown(this);
  }

  CountDown(qc:QuestionComponent) {
    var counter = setInterval(Counting, 1000);
    function Counting()
      {
        if (qc.timeleft == 0 || qc.timeleft < 0 )
         {
           clearInterval(counter);
           qc.answersDisableFlag = true;
         }
        else {
          qc.timeleft-=1;
        }
    }
  }

}
