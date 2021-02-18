import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'quiz-user',
  templateUrl: './quiz-user.component.html',
  styleUrls: ['./quiz-user.component.css']
})
export class QuizUserComponent implements OnInit {



  constructor(private router: Router ) { }

  ngOnInit() {
  }


  JoinOnClick(){
     this.router.navigate(['/lobby-outlook']);
  }

}
