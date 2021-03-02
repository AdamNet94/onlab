import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionCrudService } from '../shared/question-crud.service';
import { Question } from '../shared/question';
import { Answer } from '../shared/answer';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})

export class QuestionListComponent implements OnInit {

  studiorumId:number;
  questions: Question[];
  dummyStrings :string[] = ["A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak",". A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban",". A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban"]
  dummyQuestions:Question[] = [];
  lastActiveQuestion: Question = null;
  selectedQuestion: Question = null;
  @Output() currentQuestionChanged = new EventEmitter<Question>();


  constructor(private service: QuestionCrudService, private router: Router) {
    for(let j=0; j<4;j++){ 
      var q=new Question(0,`probakérdés?+ ${j}`,`probakérdés?+ ${j}`)
        for(let i=0; i<4;i++){ q.answers[i].text=`probaválasz${i}`};
        this.dummyQuestions.push(q);
    };
    this.selectedQuestion=this.dummyQuestions[0]; 
    console.log(this.dummyQuestions[1].text);
    console.log(this.dummyQuestions[1].answers[2]);
    if (this.service.addedQuestionSubscription == undefined) {
      this.service.addedQuestionSubscription = this.service.invokeAddedQuestion.subscribe((res: Question) => {
        this.addQuestionResult(res);
      });
    }
    if (this.service.questionListRefresh == undefined) {
      this.service.questionListRefresh = this.service.invokeQuestionListRefresh.subscribe(() => {
        this.fetchQuestionList();
      });
    }
  }

  changeCurrentQuestion(questionIndex: number) {
    this.selectedQuestion = this.dummyQuestions[questionIndex];
  }

  ngOnInit() {
    this.fetchQuestionList();
  }

  fetchQuestionList() {
    this.service.getQuestions().subscribe(result => {
      this.questions = result;
    }, error => console.error(error));
  }

  addQuestionResult(res: Question) {
    this.questions.push(res);
  }

  deleteSelectedQuestion(question: Question): void {
    this.questions = this.questions.filter(({ id }) => id !== question.id);
    this.service.deleteQuestion(question.id).subscribe(res => {
      this.fetchQuestionList();
    }, error => { console.log(error); })
  }

  onSelect(question: Question): void {
    this.selectedQuestion = question;
    if (this.selectedQuestion === this.lastActiveQuestion) {
      this.selectedQuestion = null;
    }
    this.lastActiveQuestion = this.selectedQuestion;
  }

  addQuestion(): void {
    this.router.navigate(['/question-create']); 
  }

  editQuestion(): void {
    
    this.router.navigate(['/question-edit']);
  }

}



