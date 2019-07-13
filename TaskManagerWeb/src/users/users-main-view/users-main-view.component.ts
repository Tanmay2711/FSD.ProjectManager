import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import * as _ from 'lodash';

@Component({
  selector: 'users-users-main-view',
  templateUrl: './users-main-view.component.html',
  styleUrls: ['./users-main-view.component.css']
})
export class UsersMainViewComponent implements OnInit {
  userList:Array<any>
  tempUserList:Array<any>
  searchValue : string
  userService:UsersService
  constructor(userSer:UsersService) { 
    this.userService = userSer;
    this.searchValue = '';
  }

  ngOnInit() {
   this.refreshUsers();
  }

  userAdded(user:any){
    console.log("Adding user");
    console.log(user);
    this.userList.push(user);
    this.tempUserList.push(user);
    this.onKeyUp('');
  }

  refreshUsers(){
    this.userService.get().subscribe((userlist:Array<any>) => {
      this.userList = userlist;
      this.tempUserList = userlist;
    });
  }

  onKeyUp($event){
    this.userList = this._filterByTask('');
  }

  onSeachBtnClick(trigger){
    if(trigger === 'firstName'){
      this.userList = _.sortBy(this.userList, (u) => u.firstName);
    }else if (trigger === 'lastName'){
      this.userList = _.sortBy(this.userList, (u) => u.lastName);
    } else if (trigger === 'id'){
      this.userList = _.sortBy(this.userList, (u) => u.employeeID);
    }
  }

  _filterByTask(filterValue) {
    return this.tempUserList.filter(
    user => user.firstName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
    user.lastName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
    user.employeeID === +this.searchValue.toLowerCase()
  );
  }

}
