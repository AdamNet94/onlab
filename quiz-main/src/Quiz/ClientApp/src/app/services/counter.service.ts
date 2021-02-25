import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  
  constructor() { }
  
  CountDown(timeLeft:number) {
    var counter = setInterval(Counting, 1000);
    function Counting()
      {
        if (timeLeft == 0 || timeLeft < 0 ) 
         {
           clearInterval(counter);
         }
        else {let timerhtml =  document.getElementById("timer");
          timeLeft-=1;
          timerhtml.innerHTML = timeLeft.toString()
        }
    }
  }

}
