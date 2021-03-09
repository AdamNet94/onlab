import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Question } from '../models/question';
import { Router } from '@angular/router';
import { QuestionCrudService } from '../services/question-crud.service';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.css']
})
export class QuestionEditorComponent implements OnInit {

  markupText: string[] = ['Answer 02 *', "Answer 02 *", "Answer 03 *", "Answer 04 *"]
  newQuestionflag: boolean;
  @Input() public formData: Question;
  @Output() questionChangedEvent = new EventEmitter<Question>();
  @Output() questionDeletedEvent = new EventEmitter<Question>();

  constructor(private httpservice: QuestionCrudService, private router: Router) {
  }

  hasArrived(){
    if(this.formData!=null)
      return true;
    return false;
  }

  ngOnInit() {
    if(this.formData.id == 0)
    this.resetForm();
    else this.newQuestionflag = false;
  }

  onEdit() {
    if (this.newQuestionflag) {
      console.log(this.formData);
      this.httpservice.postQuestion(this.formData).subscribe(
        question => {
          console.log("szerevertől: "+ question);
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
        () => {
          this.questionChangedEvent.emit(this.formData);
        },
        err => { console.log(err); }
      );
      for(let i=0; i <this.formData.answers.length;i++){
        let ans =this.formData.answers[i]
        this.httpservice.putAnswer(ans,ans.id).subscribe(
          ()=>{},
          err => { console.log(err); }
        );
      }
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

  setForm(){
    let editButton = document.getElementById("submitButton");
    editButton.innerHTML = "Edit question";
    this.newQuestionflag = false;
  }

  resetForm() {
    let editButton = document.getElementById("submitButton");
    editButton.innerHTML = "Save new question";
    this.newQuestionflag = true;
  }
}

