import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
@Injectable({
  providedIn: 'root'
})
export class HubBuilderService {
  getConnection() {
    return new signalR.HubConnectionBuilder()
      .withUrl("/quizhub")
      .configureLogging(signalR.LogLevel.Debug)
      .build();
  } 
}
