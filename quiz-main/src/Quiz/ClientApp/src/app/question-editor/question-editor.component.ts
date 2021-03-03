import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Question } from '../shared/question';
import { Answer } from '../shared/answer';
import { Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { QuestionCrudService } from '../shared/question-crud.service';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.css']
})
export class QuestionEditorComponent implements OnInit {

 markupText :string[] = ['Answer 02 *',"Answer 02 *","Answer 03 *","Answer 04 *"]

  @Input() public formData: Question;
  @Output() questionChangedEvent = new EventEmitter<Question>();

  constructor(private httpservice: QuestionCrudService, private router: Router) {
    //this.formData = new Question();
  }

  ngOnInit() {
   this.resetForm();
  }

  onEdit(questionForm: NgForm) {
    console.log(this.formData);
    this.httpservice.postQuestion(this.formData).subscribe(
      question => {
        this.httpservice.parseCreatedQuestion(question);
        //this.resetForm(questionForm);
       // this.router.navigate(['/question-list']);
      },
      err => { console.log(err); },
      () => { }
      
    )
    this.questionChangedEvent.emit(this.formData);
  }

  resetForm(questionCreateForm?: NgForm) {
    if (questionCreateForm != null)
      questionCreateForm.form.reset();
    this.formData = new Question();
    }
}

