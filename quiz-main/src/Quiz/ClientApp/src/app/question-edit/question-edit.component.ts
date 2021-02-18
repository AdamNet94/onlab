import { Component, Inject, OnInit } from '@angular/core';
import { Question } from '../shared/question';
import { Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { QuestionCrudService } from '../shared/question-crud.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})

export class QuestionEditComponent  {

  questionEdit: NgForm;

  static question: Question = {
    id: 0,
    name: "",
    text: "",
    answers: [{ id: 0, name: "", questionID: 0, isCorrect: false },
    { id: 0, name: "", questionID: 0, isCorrect: false },
    { id: 0, name: "", questionID: 0, isCorrect: false },
    { id: 0, name: "", questionID: 0, isCorrect: false }]
  };

  formData: Question = QuestionEditComponent.question;

  constructor(private service: QuestionCrudService, private router: Router) { }

  onSubmit(questionEditForm: NgForm) {
    for (var i = 0; i < this.formData.answers.length; i++) {
      this.service.putAnswer(this.formData.answers[i], this.formData.answers[i].id).subscribe();
    }

    this.service.putQuestion(this.formData, QuestionEditComponent.question.id).subscribe(
      question => {
        this.service.refreshQuestions();
        this.router.navigate(['/question-list']);
      },
      err => { console.log(err); }
    )
  }
}
