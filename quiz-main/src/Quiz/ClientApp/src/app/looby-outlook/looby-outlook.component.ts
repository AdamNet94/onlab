import { Component, OnDestroy, OnInit } from '@angular/core';
import { HubBuilderService } from '../services/hub-builder.service';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr'
import { User } from '../models/answer';


@Component({
  selector: 'app-looby-outlook',
  templateUrl: './looby-outlook.component.html',
  styleUrls: ['./looby-outlook.component.css']
})
export class LoobyOutlookComponent implements OnInit {

  users: User[]

  connection: signalR.HubConnection

  actualpage = "hello-page"

  constructor(private router: Router, hubbuilder: HubBuilderService) {
    this.users = [];
    this.connection = hubbuilder.getConnection()

    this.connection.on("Start", () => this.startGame());
    this.connection.on("UserJoined", users => this.userJoined(users));
    this.connection.on("SetUsers", users => this.setUsers(users));
    this.connection.on("StartGame", () => this.startGame());
    this.connection.start().then(() => {
      this.connection.invoke("EnterLobby");
    });
    

  }

  ngOnInit(): void {
    
  }


  setUsers(users: User[]) {
    this.users = users;
  }

  userJoined(user: User) {
    this.users.push(user);
  }

  onStart() {
    this.connection.invoke("Start");
  }

  startGame() {
    this.router.navigate(['/lobby']);
  }

  JoinOnClick(){
    this.actualpage = "lobbypage"
  }


}
