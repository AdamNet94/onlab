import { Component, OnInit } from '@angular/core';
import { PLAYERS } from '../leaderboard/players';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  players = PLAYERS;

  constructor() { }

  ngOnInit() {
  }

}
