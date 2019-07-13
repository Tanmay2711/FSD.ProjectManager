import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'users-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userInfo:any
  userService:UsersService
  constructor(
    userSer:UsersService
  ) { 
    this.userInfo ={};
    this.userService = userSer;
  }

  ngOnInit() {
  }

  addOrUpdateUserRecord($event){
    let userPayLoad = Object.assign({},this.userInfo);
    console.log(userPayLoad);
    this.userService.add(userPayLoad).subscribe(
      (data:any) => {
        console.log("User Added");
        // this.taskData.push(data);
         this.resetClicked(null);
        // this.navigateToViewTask();
      }

    );
  }

  resetClicked($event){
    this.userInfo ={};
  }

}
