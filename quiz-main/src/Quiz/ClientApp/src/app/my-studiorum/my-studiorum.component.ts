import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../shared/question';
import { Studiorum} from '../shared/studiorum';
import { StudiorumCrudService} from '../services/studiorum-crud.service';

@Component({
  selector: 'app-my-studiorum',
  templateUrl: './my-studiorum.component.html',
  styleUrls: ['./my-studiorum.component.css']
})
export class MyStudiorumComponent implements OnInit {

  private studiorums : Array<Studiorum> = [];

  constructor(private route: ActivatedRoute, private httpservice: StudiorumCrudService) {
    var s1 = new Studiorum(1,"some title");
    var q1 = new Question(); q1.name ="First question";
    var q2 = new Question(); q1.name ="Second question";
    var q :Question[] = [q1, q2];
    s1.questions = q;
    this.studiorums.push(s1);
  }

  ngOnInit() {

  }

  addStudiorum(title: string){
      console.log(title);
  }

  deleteStudiorum(index:number){
    this.httpservice.deleteStudiorum(this.studiorums[index].id).subscribe(
      studiorum => {},
      err => { console.log(err); },
      () => { this.studiorums.splice(index,1); }
    );
  }

}
