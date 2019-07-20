import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private headers: HttpHeaders;
  private accessPointUrl: string = environment.usersServiceUrl;
  private userEditedEventSource = new Subject<any>();

  userEditedEvent$ = this.userEditedEventSource.asObservable();

  constructor(private http: HttpClient) 
  { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public triggerUserEditedEvent(user:any){
    this.userEditedEventSource.next(user);
  }

  public get() {
    return this.http.get(this.accessPointUrl, {headers: this.headers});
  }

  public getById(userID:any) {
    return this.http.get(this.accessPointUrl +'/'+ userID, {headers: this.headers});
  }

  public add(payload: any) {
    return this.http.post(this.accessPointUrl, payload, {headers: this.headers});
  }

  public remove(payload: any) {
    return this.http.delete(this.accessPointUrl + '/' + payload.userID, {headers: this.headers});
  }

  public update(payload: any) {
    return this.http.put(this.accessPointUrl + '/' + payload.userID, payload, {headers: this.headers});
  }

}
