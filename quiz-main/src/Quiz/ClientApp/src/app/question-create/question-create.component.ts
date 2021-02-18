import { Component, Inject, OnInit } from '@angular/core';
import { Question } from '../shared/question';
import { Answer } from '../shared/answer';
import { Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { QuestionCrudService } from '../shared/question-crud.service';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.css']
})

export class QuestionCreateComponent implements OnInit {
  public formData: Question = {
    id: 0,
    name: "",
    text: "",
    answers: [{ id: 0, name: "", questionID: 0, isCorrect: false },
    { id: 0, name: "", questionID: 0, isCorrect: false },
    { id: 0, name: "", questionID: 0, isCorrect: false },
    { id: 0, name: "", questionID: 0, isCorrect: false }]
  };

  questionCreate: NgForm;
  constructor(private service: QuestionCrudService, private router: Router) { }

  ngOnInit() {
   this.resetForm();
  }

  onSubmit(questionCreateForm: NgForm) {
    this.service.postQuestion(this.formData).subscribe(
      question => {
        this.service.parseCreatedQuestion(question);
        this.resetForm(questionCreateForm);
        this.router.navigate(['/question-list']);
      },
      err => { console.log(err); }
    )
  }

  resetForm(questionCreateForm?: NgForm) {
    if (questionCreateForm != null)
      questionCreateForm.form.reset();
    this.formData = {
      id: 0,
      name: "",
      text: "",
      answers: [{ id: 0, name: "", questionID: 0, isCorrect: false },
        { id: 0, name: "", questionID: 0, isCorrect: false },
        { id: 0, name: "", questionID: 0, isCorrect: false },
        { id: 0, name: "", questionID: 0, isCorrect: false }]
    }
  }
}
