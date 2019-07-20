import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'users-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userInfo:any
  userService:UsersService
  userForm:FormGroup
  formSubmitted:boolean = false
  @Output() addedUser = new EventEmitter<any>();
  constructor(
    userSer:UsersService
  ) { 
    this.userInfo ={};
    this.userService = userSer;
  }

  ngOnInit() {
    this.formSubmitted = false;
    this.userForm = new FormGroup({
      'firstName':new FormControl(this.userInfo.firstName,
        [
          Validators.required
        ]
      ),
      'lastName':new FormControl(this.userInfo.lastName,[
        Validators.required
      ]),
      'employeeId':new FormControl(this.userInfo.employeeId,[
        Validators.required
      ])
    });
  }

  get firstName() {return this.userForm.get('firstName');}
  get lastName() {return this.userForm.get('lastName');}
  get employeeId(){return this.userForm.get('employeeId');}

  addOrUpdateUserRecord($event){
    let userPayLoad = Object.assign({},this.userInfo);
    this.formSubmitted = true;
    if(!this.userForm.valid){
      return;
    }
    this.userService.add(userPayLoad).subscribe(
      (userData:any) => {
        console.log("User Added");
         this.resetClicked(null);
         this.addedUser.emit(userData);
      }

    );

    this.ngOnInit();
  }

  resetClicked($event){
    this.userInfo ={};
    this.ngOnInit();
  }



}
