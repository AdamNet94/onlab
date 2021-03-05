import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionCrudService } from '../shared/question-crud.service';
import { Question } from '../shared/question';
import { Answer } from '../shared/answer';
import { StudiorumCrudService } from '../services/studiorum-crud.service';
import { Studiorum } from '../shared/studiorum';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})

export class QuestionListComponent implements OnInit {

  studiorumId: number;
  studiorum: Studiorum = new Studiorum();
  selectedQuestion: Question = null;
  @Output() currentQuestionChanged = new EventEmitter<Question>();


  constructor(private httpservice: StudiorumCrudService, private router: Router, route: ActivatedRoute ) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    console.log(this.studiorumId);
    this.httpservice.getStudiorum(this.studiorumId).subscribe(result => {
      var studiorum1 = new Studiorum();
      studiorum1 = result;
      console.log(result);
      this.studiorum = result;
    }, error => console.error(error));
    console.log(this.studiorum);
    this.selectedQuestion = this.studiorum.questions[0];
  }

  receiveChangedQuestion($event){
    let q:Question = $event as Question;
    let index = this.studiorum.questions.findIndex(element => element.id==q.id);
    if(index > 0)
      this.studiorum.questions[index]=q;
    else console.log("could not find question with this ID");
  }

  changeCurrentQuestion(questionIndex: number) {
    this.selectedQuestion = this.studiorum.questions[questionIndex];
  }

  ngOnInit() {
   
  }

  editQuestion(): void {
    
    this.router.navigate(['/question-edit']);
  }

}



