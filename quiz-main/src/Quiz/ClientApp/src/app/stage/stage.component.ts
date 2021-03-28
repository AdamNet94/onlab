import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css'],

  styles: [`
  .Bg {
    background-image: url('/assets/firework.jpg') !important;
    background-size: cover;
    background-position: center center;
  }
`]
})
export class StageComponent implements OnInit {

  topPlayers: Array<Player> = new Array<Player>();
  constructor() { }

  ngOnInit() {
    
  }

}
