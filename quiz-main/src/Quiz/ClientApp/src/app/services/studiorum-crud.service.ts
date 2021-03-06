import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Studiorum } from '../models/studiorum';

@Injectable({
  providedIn: 'root'
})
export class StudiorumCrudService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') readonly baseUrl: string, readonly router: Router) { }


  getStudiorums() {
    return this.httpClient.get<Studiorum[]>(this.baseUrl + 'api/Studiorum');
  }

  getStudiorum(id: number) {
    return this.httpClient.get<Studiorum>(this.baseUrl + 'api/Studiorum/'+ id);
  }

  postStudiorum(studiorum : Studiorum) {
    return this.httpClient.post<Studiorum>(this.baseUrl + 'api/Studiorum',studiorum);
  }

  putStudiorum(studiorum: Studiorum, id:number) {
    return this.httpClient.put<Studiorum>(this.baseUrl + 'api/Studiorum/' + id, studiorum);
  }

  deleteStudiorum(id:number) {
    return this.httpClient.delete<Studiorum>(this.baseUrl + 'api/Studiorum/' + id);
  }

}
