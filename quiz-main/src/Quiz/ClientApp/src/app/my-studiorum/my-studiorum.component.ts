import { Component, OnInit } from '@angular/core';
import { Studiorum} from '../models/studiorum';
import { StudiorumCrudService} from '../services/studiorum-crud.service';
import { Router,NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-my-studiorum',
  templateUrl: './my-studiorum.component.html',
  styleUrls: ['./my-studiorum.component.css']
})
export class MyStudiorumComponent implements OnInit {

  private studiorums : Array<Studiorum> = [];

  constructor(private router: Router, private httpservice: StudiorumCrudService) {
    this.httpservice.getStudiorums().subscribe(result => {
      this.studiorums = result;
    }, error => console.error(error));
  }

  isEmpty(i:number): boolean{
    let questions = this.studiorums[i].questions;
    if(questions!= null)
      if(questions.length > 0)
        return false;
    return true;
  }

  ngOnInit() {
    
  }

  navigateToQuestions(index:number) {
    let studiorumId = this.studiorums[index].id;
    this.router.navigate(['my-studiorum/',studiorumId]);
  }

  startQuiz(index:number){
    let studiorumId = this.studiorums[index].id;
    let lobbyId = this.getRandomInt();
    this.router.navigate(['lobby/',studiorumId,lobbyId]);
  }

  addStudiorum(title: string) {
    var newStudiorum = new Studiorum(0,title);
    this.httpservice.postStudiorum(newStudiorum).subscribe(result => {
      this.studiorums.push(result);
    }, error => console.error(error));
  }

  deleteStudiorum(index:number){
    this.httpservice.deleteStudiorum(this.studiorums[index].id).subscribe(
      studiorum => {},
      err => { console.log(err); },
      () => { this.studiorums.splice(index,1); }
    );
  }

  getRandomInt(max=10000){
    return Math.floor(Math.random() * Math.floor(max));
  }

}
