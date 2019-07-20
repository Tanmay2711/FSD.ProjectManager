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
  tempUserInfoForEdit:any
  userService:UsersService
  userForm:FormGroup
  formSubmitted:boolean = false
  addUserButtonText:string
  @Output() addedUser = new EventEmitter<any>();
  @Output() editedUser = new EventEmitter<any>();
  constructor(
    userSer:UsersService
  ) 
  { 
    this.userInfo = {};
    this.tempUserInfoForEdit = {};
    this.userService = userSer;
    this.userService.userEditedEvent$.subscribe((user:any) =>{
      this.userInfo = Object.assign({},user);
      this.tempUserInfoForEdit = Object.assign({},user);
      this.addUserButtonText = "Update";
    })
  }

  ngOnInit() {
    this.addUserButtonText = "Add";
    this.setUserForm();
  }

  get firstName() {return this.userForm.get('firstName');}
  get lastName() {return this.userForm.get('lastName');}
  get employeeID(){return this.userForm.get('employeeID');}

  addOrUpdateUserRecord($event){
    let userPayLoad = Object.assign({},this.userInfo);
    this.formSubmitted = true;
    if(!this.userForm.valid){
      return;
    }

    if(this.userInfo.userID > 0){
        this.userService.update(userPayLoad).subscribe((userData:any) => {
          console.log("User Updated");
          this.tempUserInfoForEdit = Object.assign({}, this.userInfo);
          this.editedUser.emit(userPayLoad);
        });
    } else {
      this.userService.add(userPayLoad).subscribe(
        (userData:any) => {
          console.log("User Added");
          this.resetClicked(null);
          this.addedUser.emit(userData);
        });
    }

    this.setUserForm();
  }

  resetClicked($event){
    this.userInfo = Object.assign({},this.tempUserInfoForEdit);
    this.setUserForm();
  }

  setUserForm(){
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
      'employeeID':new FormControl(this.userInfo.employeeID,[
        Validators.required
      ])
    });
  }


}
