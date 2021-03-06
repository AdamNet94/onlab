import { Component, OnInit } from '@angular/core';
import { Studiorum} from '../models/studiorum';
import { StudiorumCrudService} from '../services/studiorum-crud.service';
import { Router } from '@angular/router';


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

  ngOnInit() {
   
  }

  navigateToQuestions(id:number) {
    this.router.navigate(['my-studiorum/studiorumId', { studiorumId: id + 1 }]);
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

}
