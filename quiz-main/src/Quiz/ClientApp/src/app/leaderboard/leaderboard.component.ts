import { Component, OnInit } from '@angular/core';
import { PLAYERS } from './players';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  players = PLAYERS;

  sortTable() {
    this.players.sort((a,b) => (b.points > a.points) ? 1 : ((a.points > b.points) ? -1 : 0));
  }

  constructor() { }

  ngOnInit() {
    this.sortTable();
  }

}
