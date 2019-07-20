import { Component, OnInit, Input } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith } from 'rxjs/operators';
import { TaskService } from '../task.service';
import * as _ from 'lodash';
import { Router,ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  taskService : TaskService
  public isEditView:boolean= false
  taskData:Array<any>
  router: Router
  AddTaskText:string="Add Task"
  CancelTaskText:string="Reset"
  ToolTipText: string = "0";
  @Input() taskInfo : any
  previousTaskInfo : any
  myControl = new FormControl();
  projectNameControl = new FormControl();
  userNameControl = new FormControl();
  options: string[];
  projectList:Array<any>;
  userList:Array<any>;
  filteredOptions: Observable<string[]>;
  filteredProjects:Observable<Array<any>>;
  filteredUsers:Observable<Array<any>>;
  constructor(taskSer : TaskService,
    private route: ActivatedRoute,
    ro: Router,
    private projectService:ProjectsService,
    private usersService:UsersService) { 
    this.taskService = taskSer;
    this.router = ro;
    this.taskInfo = {
      tasksID: 0,
      name:undefined,
      parentName:undefined,
      startDate:undefined,
      endDate:undefined,
      priority:0,
      project:{
        projectID:0,
        projectName:null,
        startDate:null,
        endDate:null,
        priority:0,
        managerID:0
      },
      user:{
        userId:0,
        firstName:'',
        lastName:'',
        employeeId:0
      }
    };

    let id = this.route.snapshot.paramMap.get('taskId');
    if(id){
      this.isEditView = true;
    }else{
      this.isEditView = false;
    }
  }

  ngOnInit() {
    this.taskService.get().subscribe((data: any) => 
    {
      this.taskData = data;
      let id = this.route.snapshot.paramMap.get('taskId');
      if(id){
        this.taskService.getById(+id).subscribe((data:any) => {
            if(data.status && data.status.toLowerCase() === 'completed'){
              alert("This task is completed and cannot be edited.");
              this.navigateToViewTask();
              return;
            }
            this.taskInfo = data;
            _.assignIn(this.taskInfo,{parentName:this.getParentTaskName(this.taskData,data.parentID) || ''});
            this.previousTaskInfo = Object.assign({},this.taskInfo);
            this.isEditView = true;
            this.ToolTipText = this.taskInfo.priority.toString();
        });
        this.isEditView = true;
        this.AddTaskText = "Update";
        this.CancelTaskText = "Cancel";
      }

      this.options = this.taskData.filter(obj => obj.tasksID !== +id).map(obj => obj.name);      
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

    this.projectService.get().subscribe((data:Array<any>) =>{
        this.projectList = data;
        this.filteredProjects = this.projectNameControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.projectName),
          map(projectName => projectName ? this.filterProjectNames(projectName) : this.projectList.slice())
        );

    });

    this.usersService.get().subscribe((data:Array<any>) => {

      this.userList = data;
      this.filteredUsers = this.userNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.firstName + ' ' + value.lastName),
        map(name => name ? this.filterUser(name) : this.userList.slice())
      );
    });

  }
  filterProjectNames(projectName: any): any {
    const filterValue = projectName.toLowerCase();

    return this.projectList.filter(option => option.projectName.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterUser(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.userList.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0 || option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

  projectDisplayFn(project?: any): string | undefined {
    return project ? project.projectName : '';
  }

  userDisplayFn(user?: any): string | undefined {
    return user && user.userID > 0 ? user.firstName + " " + user.lastName : '';
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  clearTaskInfo = function() {
    // Create an empty jogging object
    this.taskInfo = {
      tasksID: 0,
      name:undefined,
      parentName:undefined,
      startDate:undefined,
      endDate:undefined,
      priority:0,
      project:{
        projectID:0,
        projectName:null,
        startDate:null,
        endDate:null,
        priority:0,
        managerID:0
      },
      user:{
        userId:0,
        firstName:'',
        lastName:'',
        employeeId:0
      }
    };
  };

  navigateToViewTask(){
    this.router.navigate(['/viewtask']);
  }

  getParentTaskName(taskList,parentID){
    var parentTaskName = (_.find(taskList, el => el.tasksID === parentID) || {}).name;
    return parentTaskName;
  }

  public addOrUpdateTaskRecord = function($event) {

    let taskWithId,parentTask;
    parentTask = _.find(this.taskData, (el => el.name === this.taskInfo.parentName));
    taskWithId = _.find(this.taskData, (el => el.tasksID === this.taskInfo.tasksID));
    let taskPayLoad = {   
        tasksID: (taskWithId || {}).tasksID,
        parentID: (parentTask || {}).tasksID,
        name: this.taskInfo.name,
        startDate: this.taskInfo.startDate,
        endDate: this.taskInfo.endDate,
        priority: this.taskInfo.priority,
        userID:this.taskInfo.user.userID,
        projectID:this.taskInfo.project.projectID
    };
    if (taskWithId) {
      this.taskService.update(taskPayLoad).subscribe(
        () => this.navigateToViewTask()
      );
    } else {
      this.taskService.add(taskPayLoad).subscribe(
        (data:any) => {
          this.taskData.push(data);
          this.clearTaskInfo();
          this.navigateToViewTask();
        }

      );
    }
  }

  resetClicked($event){
    if(this.isEditView){
      this.taskInfo = Object.assign({},this.previousTaskInfo);
      this.ToolTipText = this.taskInfo.priority.toString();
      return;
    }

    this.clearTaskInfo();
    this.ToolTipText = this.taskInfo.priority.toString();
  }

  onRangeInput($event){
    this.ToolTipText = this.taskInfo.priority.toString();
  }

}
