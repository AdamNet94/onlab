import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

studiorumId:number;
quizPin:number;

  constructor(private route:ActivatedRoute) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    this.quizPin = this.getRandomInt();
   }

  ngOnInit() {

  }

  getRandomInt(max=10000) {
    return Math.floor(Math.random() * Math.floor(max));
  }

}
