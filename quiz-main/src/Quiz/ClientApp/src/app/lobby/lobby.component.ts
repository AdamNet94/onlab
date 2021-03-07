import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  studiorumId:number;
  quizPin:number;

  constructor(private route:ActivatedRoute, private signalRConnection :SignalRService) {
    this.studiorumId = Number(route.snapshot.paramMap.get('studiorumId'));
    this.quizPin = this.getRandomInt();
  }

  ngOnInit() {
    this.signalRConnection.AddReceiveMessageListener();
    this.signalRConnection.startConnection();
  }

  getRandomInt(max=10000) {
    return Math.floor(Math.random() * Math.floor(max));
  }

}
