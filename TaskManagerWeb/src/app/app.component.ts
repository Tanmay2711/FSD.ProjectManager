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
  isEdit:boolean=false
  onActivate(componentRef){

    //this is not proper way to set the link text and add css class
    //this must be hnadled through router events
    if(componentRef.isEditView){
      this.addTaskLinkText = "Edit Task";
      this.isEdit = true;
    } else {
      this.addTaskLinkText = "Add Task";
      this.isEdit = false;
    }
  }
}
