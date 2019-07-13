import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'users-users-main-view',
  templateUrl: './users-main-view.component.html',
  styleUrls: ['./users-main-view.component.css']
})
export class UsersMainViewComponent implements OnInit {
  userList:Array<any>
  userService:UsersService
  constructor(userSer:UsersService) { 
    this.userService = userSer;
  }

  ngOnInit() {
   this.refreshUsers();
  }

  userAdded(user:any){
    console.log("Adding user");
    console.log(user);
    this.userList.push(user);
  }

  refreshUsers(){
    this.userService.get().subscribe((userlist:Array<any>) => {
      this.userList = userlist;
    });
  }

}
