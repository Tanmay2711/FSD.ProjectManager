import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { UsersService } from 'src/users/users.service';

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
  ToolTipText: string = "0";
  constructor(private userService:UsersService) { 
    this.projectInfo = {
      projectID:0,
      projectName:'',
      startDate:'',
      endDate:'',
      priority:0,
      manager:{
        userId:0,
        firstName:'',
        lastName:'',
        employeeId:0
      }
    };
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
  }

  displayFn(user?: any): string | undefined {
    return user ? user.firstName + " " + user.lastName : undefined;
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

  addOrUpdateProjectRecord($event){
    console.log(this.projectInfo);
  }

  onRangeInput($event){
    this.ToolTipText = this.projectInfo.priority.toString();
  }

  onSelectClick($event){
    console.log($event);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.userList.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0 || option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

}
