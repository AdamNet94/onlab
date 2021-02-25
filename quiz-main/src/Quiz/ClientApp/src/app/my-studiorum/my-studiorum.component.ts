import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../shared/question';
import { Studiorum} from '../shared/studiorum'

@Component({
  selector: 'app-my-studiorum',
  templateUrl: './my-studiorum.component.html',
  styleUrls: ['./my-studiorum.component.css']
})
export class MyStudiorumComponent implements OnInit {

  private studiorums : Array<Studiorum> = [];
  constructor(private route: ActivatedRoute) {
    var s1 = new Studiorum("soem title");
    var q1 = new Question(); q1.name ="First question";
    var q2 = new Question(); q1.name ="Second question";
    var q :Question[] = [q1, q2];
    s1.questions = q;
    this.studiorums.push(s1);
    this.studiorums.length
  }

  ngOnInit() {

  }

  EditStudiorum(){
    this.route
  }

}
