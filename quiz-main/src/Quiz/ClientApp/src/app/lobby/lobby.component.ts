import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from '../models/quiz';
import { SignalAdminService } from '../services/signal-admin.service';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  studiorumId:number;
  quizPin:number;
  players:Array<string> = new Array<string>();
  quiz:Quiz=new Quiz();

  constructor(private route:ActivatedRoute, private signalAdminConnection :SignalAdminService) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    this.quizPin = this.getRandomInt();
  }

  ngOnInit() {
    this.signalAdminConnection.AddQuizIdListener(this.quiz);
    this.signalAdminConnection.AddRenderNewPlayerListener(this.players);
    this.signalAdminConnection.startConnectionAdmin(this.quizPin.toString(),"admin"+this.quizPin.toString());
    console.log(this.players);
  }

  onStart(){
    this.signalAdminConnection.startGame(1,this.quizPin.toString());
  }

  getRandomInt(max=10000){
    return Math.floor(Math.random() * Math.floor(max));
  }

}
