import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('/quizhub').build();
  private quizid: number;
  private Pin: number;

    startConnection(){
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err)).then(() =>this.getQuiz())
    }

  getQuiz() {
    try {
      this.hubConnection.invoke("GetQuizPin", "roomNumber1");/*.then(
        (data) => {
          console.log(data);
        })*/
    } catch (err) {
      console.error(err);
    }
      
     
  }

  AddReceiveMessageListener() {
    this.hubConnection.on('ReceiveMessage', (id,message) => {
      console.log(id+" "+message);
    });
  }


}
