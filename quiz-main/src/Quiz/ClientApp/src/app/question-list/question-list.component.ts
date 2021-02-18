import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionCrudService } from '../shared/question-crud.service';
import { QuestionEditComponent } from '../question-edit/question-edit.component';
import { Question } from '../shared/question';
import { Answer } from '../shared/answer';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})

export class QuestionListComponent implements OnInit{

  questions: Question[];

  lastActiveQuestion: Question = null;
  selectedQuestion: Question = null;

  constructor(private service: QuestionCrudService, private router: Router) {
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
    QuestionEditComponent.question = this.selectedQuestion;
    this.router.navigate(['/question-edit']);
  }

}



