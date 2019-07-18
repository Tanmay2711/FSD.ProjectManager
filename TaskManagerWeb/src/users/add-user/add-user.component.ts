import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'users-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userInfo:any
  userService:UsersService
  @Output() addedUser = new EventEmitter<any>();
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
      (userData:any) => {
        console.log("User Added");
         this.resetClicked(null);
         this.addedUser.emit(userData);
      }

    );
  }

  resetClicked($event){
    this.userInfo ={};
  }

}
