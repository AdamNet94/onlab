import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../services/counter.service';
import { Question } from '../models/question';
import { QuizState } from '../models/quiz-state';
import { Answer } from '../models/answer';
import { AnswerSubmit } from '../models/answer-submit';
import { animate, state, style, transition, trigger } from '@angular/animations';

/*,
      transition(':leave', [
        animate(400, style({ transform: 'translateX(100%)' }))
      ])*/

@Component({
  selector: 'app-question',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(400)
      ])
    ])
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  
})
export class QuestionComponent implements OnInit {
  
  @Input() public question:Question;
  readonly initTime = 10;
  timeleft = this.initTime;
  answerSelected:number = -1 ;
  colors:string[]=['#e21b3c',
  '#d89e00',
  '#1368ce',
  '#26890c'];
  answersDisableFlag:boolean = false;
  @Output() answerSubmittedEvent = new EventEmitter<AnswerSubmit>();
  @Output() timeIsUpEvent = new EventEmitter<void>();

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
    this.answerSelected = index;
    var answerPacakge:AnswerSubmit = {
      answerId: this.question.answers[index].id,
      timeLeft:this.timeleft,
      initTime: this.initTime
    };
      this.answerSubmittedEvent.emit(answerPacakge);
  }

  NextQuestion(nextQuestion:Question){
    this.question = nextQuestion;
    this.answersDisableFlag= false;
    this.timeleft=this.initTime;
    this.answerSelected = -1;
    this.CountDown(this);
  }

  CountDown(qc:QuestionComponent) {
    var counter = setInterval(Counting, 1000);
    function Counting()
      {
        if (qc.timeleft == 0 || qc.timeleft < 0 )
         {
           clearInterval(counter);
           qc.timeIsUpEvent.emit();
         }
        else {
          qc.timeleft-=1;
        }
    }
  }

}
