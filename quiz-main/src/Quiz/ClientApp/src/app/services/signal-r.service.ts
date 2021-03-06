import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  private hubConnection: signalR.HubConnection
  private quizid:number;

    startConnection(){
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:4200/quizhub')
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

    getQuizId(){
    this.hubConnection.invoke('GetQuiz', (data) => {
      this.quizid = data;
      console.log(data);
    });
  }
  
}
