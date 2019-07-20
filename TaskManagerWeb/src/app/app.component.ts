import {  AfterViewInit, ViewChild,Component } from '@angular/core';
import { AddTaskComponent } from './add-task/add-task.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project Manager';
  addTaskLinkText : string = "Add Task";
  onActivate(componentRef){
    //this.addTaskLinkText = componentRef.isEditView ? "Edit Task" : "Add Task";
  }
}
