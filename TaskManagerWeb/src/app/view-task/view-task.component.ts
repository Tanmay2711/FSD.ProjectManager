import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material';

const noParentTaskText : string = "This Task Has NO Parent";
@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {
  taskService : TaskService
  taskData : Array<any>
  tempTaskData : Array<any>
  filteredTaskData : Observable<Array<any>>
  taskInputControl = new FormControl();
  searchModel : any
  parentTaskInputControl = new FormControl();
  constructor(private taskSer: TaskService) { 
    this.taskService = taskSer;
    this.searchModel ={
      taskName:'',
      parentTaskName:'',
      priorityFrom:'',
      priorityTo:'',
      startDate:'',
      endDate:'',
      projectName:''
    };
  }

  modifyTaskData(data : Array<any>){
    _.forEach(data, function(obj) {
      var parentTaskName = (_.find(data, el => el.tasksID === obj.parentID) || {}).name;
      _.assignIn(obj,{parentTaskName:parentTaskName || noParentTaskText});
    });

    return data;
  }
  ngOnInit() {
    this.taskService.get().subscribe((data: any) => 
    {
      this.taskData = this.modifyTaskData(data);
      this.tempTaskData = this.taskData;
      this.filteredTaskData = this.taskInputControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterByTask(value))
      );
    });
  }

  _filterByTask(filterValue) {
    return this.tempTaskData.filter(
    task => task.name.toLowerCase().includes(this.searchModel.taskName.toLowerCase()) 
    && task.parentTaskName.toLowerCase().includes(this.searchModel.parentTaskName.toLowerCase())
    && 
    (
      task.priority >= +(this.searchModel.priorityFrom || 0) && task.priority <= +(this.searchModel.priorityTo || 30)
    )
    && 
    (
      (this.searchModel.startDate || '') === '' || this.searchModel.startDate.getDate() === new Date(task.startDate).getDate()
    )
    && 
    (
      (this.searchModel.endDate || '') === '' || this.searchModel.endDate.getDate() === new Date(task.endDate).getDate()
    )
    &&
    (
      task.project.projectName.toLowerCase().includes(this.searchModel.projectName.toLowerCase())
    )
    );
  }

  deleteClicked(task:any){
    this.taskService.remove(task).subscribe(() => {
      this.taskData.splice(this.taskData.indexOf(task),1);
    });
  }

  editClicked(record) {
  };

  clearSearchModel(){
    this.searchModel ={
      taskName:'',
      parentTaskName:'',
      priorityFrom:'',
      priorityTo:'',
      startDate:'',
      endDate:''
    };
  }

  onKeyUp($event){
    this.taskData = this._filterByTask('');
  }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>){
    this.taskData = this._filterByTask('');
  }
}
