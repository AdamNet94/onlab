import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { SignalRService } from './signal-r.service';


@Injectable({
  providedIn: 'root'
})
export class SignalAdminService extends SignalRService {

  constructor() {
    super();
  }

  startConnectionAdmin(pin:string,user:string){      
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err)).then(()=> this.joinGroup(pin,user))
    }

  AddRenderNewPlayerListener(users:Array<string>){
    this.hubConnection.on("RenderNewPlayer", (newUser) =>{
      users.push(newUser);
      console.log(newUser);
    })
  }

  startGame(studiorumid:number,quizpin:string){
    this.hubConnection.invoke("StartGame",studiorumid,quizpin);
  }

  joinGroup(pin:string,user:string){
    try {
      this.hubConnection.invoke("JoinGroup", pin,user);
    }catch (err) {
      console.error(err);
    }
  }

}
