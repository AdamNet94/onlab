import { Component, EventEmitter,OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../models/question';
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

  constructor(private httpservice: StudiorumCrudService,route: ActivatedRoute ) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
  }

  ngOnInit() {
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
    this.selectedQuestion = q;
  }

  receiveDeletedQuestion($event) {
    let q: Question = $event as Question;
    let index = this.studiorum.questions.findIndex(element => element.id == q.id);
    if (index > 0)
      this.studiorum.questions.splice(index, 1);
    this.selectedQuestion = this.studiorum.questions[0];
  }

  changeCurrentQuestion(questionIndex: number) {
    this.selectedQuestion = this.studiorum.questions[questionIndex];
    console.log(this.selectedQuestion.id);
    // 0 due to a new question will not have an Id, the default Id is 0
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



