import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private headers: HttpHeaders;
  private accessPointUrl: string = environment.projectServiceUrl;

  constructor(private http: HttpClient) 
  { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public get() {
    // Get all tasks data
    return this.http.get(this.accessPointUrl, {headers: this.headers});
  }

  public getById(tasksID:any) {
    // Get all tasks data
    return this.http.get(this.accessPointUrl +'/'+ tasksID, {headers: this.headers});
  }

  public add(payload: any) {
    return this.http.post(this.accessPointUrl, payload, {headers: this.headers});
  }

  public remove(payload: any) {
    return this.http.delete(this.accessPointUrl + '/' + payload.tasksID, {headers: this.headers});
  }

  public update(payload: any) {
    return this.http.put(this.accessPointUrl + '/' + payload.tasksID, payload, {headers: this.headers});
  }

}
