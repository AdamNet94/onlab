import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../services/counter.service';
import { Question } from '../models/question';
import { QuizState } from '../models/quiz-state';
import { Answer } from '../models/answer';
import { AnswerSubmit } from '../models/answer-submit';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
        animate(300)
      ])
    ])
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  
  @Input() public question:Question;
  @Input() public timeLeft:number;
  answerSelected:number = -1 ;
  colors:string[] = ['#e21b3c',
  '#d89e00',
  '#1368ce',
  '#26890c'];
  answersDisableFlag:boolean = false;
  questionPreview:boolean = false;
  previewTime:number = 3;
  @Output() answerSubmittedEvent = new EventEmitter<number>();
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
    if(!this.answersDisableFlag)
      this.answerSelected = index;
    this.answersDisableFlag = true;
    this.answerSubmittedEvent.emit(this.question.answers[index].id);
  }

  NextQuestion(nextQuestion:Question){
    this.question = nextQuestion;
    this.answersDisableFlag= false;
    this.answerSelected = -1;
    if(this.question.answers == undefined || this.question.answers.length == 0)
      {
        console.log("nextquestion -> questionPreview" );
        this.questionPreview = false;
        console.log(this.questionPreview);
      }
    else {
      console.log("nextquestion -> REAL ANSWERS COMING");
      this.questionPreview= true;
      console.log(this.questionPreview);
    }
  }


}
