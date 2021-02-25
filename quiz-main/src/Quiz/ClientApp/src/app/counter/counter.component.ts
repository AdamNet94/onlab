import { Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {

  constructor() { }
  private timeLeft = 5;

  ngOnInit() {
    var cnt = 10;
    this.CountDown(cnt);
  }

  CountDown(timeLeft:number) {
    setInterval(function(){
      let timerhtml =  document.getElementById("timer");
    if (timeLeft == 0 || timeLeft <0)
      clearInterval(timeLeft);
    timeLeft-=1;
    timerhtml.innerHTML = timeLeft.toString()
    console.log(timeLeft)
    }, 1000);
  }

}
