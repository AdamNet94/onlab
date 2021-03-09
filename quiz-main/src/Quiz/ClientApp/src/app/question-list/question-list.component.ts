import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionCrudService } from '../services/question-crud.service';
import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { StudiorumCrudService } from '../services/studiorum-crud.service';
import { Studiorum } from '../models/studiorum';
import { QuestionEditorComponent } from '../question-editor/question-editor.component';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})

export class QuestionListComponent implements OnInit {

  @ViewChild(QuestionEditorComponent, { static: false }) child;

  studiorumId: number;
  studiorum: Studiorum = new Studiorum();
  selectedQuestion: Question;
  @Output() currentQuestionChanged = new EventEmitter<Question>();


  constructor(private httpservice: StudiorumCrudService, private router: Router, route: ActivatedRoute ) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    console.log(this.studiorumId);
    this.httpservice.getStudiorum(this.studiorumId).subscribe(result => {
      this.studiorum = result;
      if(result.questions.length > 0)
      {
        console.log(this.studiorum.questions[0]);
      }
      else{
        var newQuestion = new Question();
        newQuestion.studiorumId=this.studiorumId;
        this.studiorum.questions.push(newQuestion);
      }
      this.selectedQuestion = this.studiorum.questions[0];
    }, error => console.error(error));
  }

  isEmpty(){
    if(this.selectedQuestion!=null)
        return true;
    return false;
  }

  ngOnInit() {

  }

  receiveChangedQuestion($event){
    let q:Question = $event as Question;
    let index = this.studiorum.questions.findIndex(element => element.id == q.id);

    if (index > 0)
      this.studiorum.questions[index] = q;
      /*
       if we cannot find in the list, then it's a new question and it was added already in
       createQuestion() method
       */
    else this.studiorum.questions[this.studiorum.questions.length-1] = q;
  }

  receiveDeletedQuestion($event) {
    let q: Question = $event as Question;
    let index = this.studiorum.questions.findIndex(element => element.id == q.id);
    if (index > 0)
      this.studiorum.questions.splice(index, 1);
    this.selectedQuestion = this.studiorum.questions[0];
    console.log("meghivva");
  }

  changeCurrentQuestion(questionIndex: number) {
    this.selectedQuestion = this.studiorum.questions[questionIndex];
    console.log(this.selectedQuestion.id);
    if(this.selectedQuestion.id == 0)
      this.child.resetForm();
    else this.child.setForm();
  }

  createQuestion() {
    var lastQuestion = this.studiorum.questions[this.studiorum.questions.length - 1];
    if (lastQuestion.id != 0) {
      this.selectedQuestion = new Question();
      this.selectedQuestion.studiorumId = this.studiorumId;
      this.studiorum.questions.push(this.selectedQuestion);
    }
    else this.selectedQuestion = lastQuestion;
  }



}



