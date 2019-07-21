import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { UsersService } from 'src/users/users.service';
import * as _ from 'lodash';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  myControl = new FormControl();
  filteredUsers:Observable<Array<any>>;
  userList:Array<any>;
  projectInfo:any;
  tempProjectInfoForEdit:any
  ToolTipText: string = "0";
  isStartDatEndDate:boolean;
  @Output() projectAdded = new EventEmitter<any>();
  @Output() projectEdited = new EventEmitter<any>();
  isDatesChanged : BehaviorSubject<any>;
  projectForm: any;
  formSubmitted: boolean;
  addButtonText:string = "Add"
  constructor(private userService:UsersService,
    private projectService:ProjectsService) { 
    this.projectInfo = {
      projectID:0,
      projectName:null,
      startDate:null,
      endDate:null,
      priority:0,
      managerID:0,
      manager:null
    };

    this.tempProjectInfoForEdit = Object.assign({},this.projectInfo);
    this.tempProjectInfoForEdit.manager = '';
    this.isDatesChanged = new BehaviorSubject<any>(this.projectInfo);
  }
  

  ngOnInit() {
    this.userService.get().subscribe((data : Array<any>) => {
      this.userList = data;

      this.filteredUsers = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.firstName + ' ' + value.lastName),
          map(name => name ? this._filter(name) : this.userList.slice())
        );
    });

    this.setProjectForm();

    this.projectService.projectUpdatedEvent$.subscribe((project) => {
      console.log(project);
      this.projectInfo = Object.assign({}, project);
      this.tempProjectInfoForEdit = Object.assign({}, project);
      this.addButtonText = "Update";
      this.isDatesChanged.next(project);
    });

    this.isDatesChanged.subscribe((projectInfo) => {
      if(projectInfo.startDate || projectInfo.endDate){
        this.isStartDatEndDate = true;
      }
    })
  }

  displayFn(user?: any): string | undefined {
    return user && user.userID > 0 ? user.firstName + " " + user.lastName : '';
  }

  //remove this for test only
  onManagerInput($event){
    console.log($event);
  }

  //remove this for test only
  managerSelected($event){
    console.log($event);
    console.log(this.projectInfo);
  }

  addOrUpdateProjectRecord(){
    this.formSubmitted = true;
    if(!this.projectForm.valid){
      return;
    }
    let projectPayLoad = Object.assign({}, this.projectInfo);
    _.assign(projectPayLoad,{managerID:projectPayLoad.manager.userID});
    projectPayLoad.manager = null;

    if(projectPayLoad.projectID > 0) {
      this.projectService.update(projectPayLoad).subscribe((data) => {
          this.tempProjectInfoForEdit = Object.assign({}, this.projectInfo);
          this.projectEdited.emit(this.projectInfo);
      });

    } else {
    this.projectService.add(projectPayLoad).subscribe((data) =>
    {
        console.log("Project Added");
        console.log(data);
        this.projectAdded.emit(data);
        this.resetClicked();
    });
  }

    this.setProjectForm();
  }

  onRangeInput($event){
    this.ToolTipText = this.projectInfo.priority.toString();
  }

  onIsStartDatEndDateChange(isStartDatEndDate){
    if(!isStartDatEndDate){
      _.assign(this.projectInfo,{startDate:null,endDate:null});
    }
  }

  resetClicked(){
    this.projectInfo = Object.assign({},this.tempProjectInfoForEdit);
    this.isDatesChanged.next(this.projectInfo);
    this.setProjectForm();
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.userList.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0 || option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

  setProjectForm(){
    this.formSubmitted = false;
    this.projectForm = new FormGroup({
      'projectName':new FormControl(this.projectInfo.projectName,
        [
          Validators.required
        ]
      ),
      'managerName':new FormControl(this.projectInfo.manager,
        [
          Validators.required
        ]
      ),
      'dateCheckBox':new FormControl(this.isStartDatEndDate,[]),
      'startDate':new FormControl(this.projectInfo.startDate,[]),
      'endDate':new FormControl(this.projectInfo.endDate,[]),
      'priority':new FormControl(this.projectInfo.priority,[])
    });
  }

  get projectName(){return this.projectForm.get('projectName');}
  get managerName(){return this.projectForm.get('managerName');}
  get dateCheckBox(){return this.projectForm.get('dateCheckBox');}
  get startDate(){return this.projectForm.get('startDate');}
  get endDate(){return this.projectForm.get('endDate');}
  get priority(){return this.projectForm.get('priority');}

}
