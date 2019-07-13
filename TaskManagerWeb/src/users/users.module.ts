import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersMainViewComponent } from './users-main-view/users-main-view.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UsersService } from './users.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AddUserComponent,
    UsersMainViewComponent]
    ,
  providers:[UsersService]
})
export class UsersModule { }
