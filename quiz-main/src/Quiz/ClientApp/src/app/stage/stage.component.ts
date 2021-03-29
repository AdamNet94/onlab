import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
export class StageComponent implements OnInit{

  @Input() topPlayers: Player[] = [];
  constructor() { }

  /*
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'topPlayers': {
            
          }
        }
      }
    }
  }
  */

  ngOnInit() {
    
  }

}
