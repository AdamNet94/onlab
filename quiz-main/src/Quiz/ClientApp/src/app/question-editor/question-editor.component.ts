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

  markupText: string[] = ['Answer 02 *', "Answer 02 *", "Answer 03 *", "Answer 04 *"]
  newQuestionflag: boolean = false;
  @Input() public formData: Question;
  @Output() questionChangedEvent = new EventEmitter<Question>();
  @Output() questionDeletedEvent = new EventEmitter<Question>();

  constructor(private httpservice: QuestionCrudService, private router: Router) {

  }

  ngOnInit() {
    console.log(this.formData);
  }

  onEdit() {
    if (this.newQuestionflag) {
      console.log(this.formData);
      this.httpservice.postQuestion(this.formData).subscribe(
        question => {
          this.questionChangedEvent.emit(question);
        },
        err => { console.log(err); },
      );
      this.newQuestionflag = false;
      let editButton = document.getElementById("submitButton");
      editButton.innerHTML = "Edit Question";
    }
    else {
      console.log(this.formData);
      this.httpservice.putQuestion(this.formData, this.formData.id).subscribe(
        question => {
          this.questionChangedEvent.emit(question);
        },
        err => { console.log(err); }
      );
    }
  }

  deleteQuestion() {
    this.httpservice.deleteQuestion(this.formData.id).subscribe(
      question => {
        this.questionDeletedEvent.emit(question);
      },
      err => { console.log(err); },
    );
  }

  resetForm() {
    let editButton = document.getElementById("submitButton");
    editButton.innerHTML = "Save new question";
    this.newQuestionflag = true;
  }
}

