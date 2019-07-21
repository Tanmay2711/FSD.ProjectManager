import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private headers: HttpHeaders;
  private accessPointUrl: string = environment.projectServiceUrl;

  private projectUpdatedEventSource = new Subject<any>();

  projectUpdatedEvent$ = this.projectUpdatedEventSource.asObservable();

  constructor(private http: HttpClient) 
  { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public triggerProjectUpdatedEvent(project:any){
    this.projectUpdatedEventSource.next(project);
  }

  public get() {
    // Get all tasks data
    return this.http.get(this.accessPointUrl, {headers: this.headers});
  }

  public getById(projectID:any) {
    // Get all tasks data
    return this.http.get(this.accessPointUrl +'/'+ projectID, {headers: this.headers});
  }

  public add(payload: any) {
    return this.http.post(this.accessPointUrl, payload, {headers: this.headers});
  }

  public remove(payload: any) {
    return this.http.delete(this.accessPointUrl + '/' + payload.projectID, {headers: this.headers});
  }

  public update(payload: any) {
    return this.http.put(this.accessPointUrl + '/' + payload.projectID, payload, {headers: this.headers});
  }

}
