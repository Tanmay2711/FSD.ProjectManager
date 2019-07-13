import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersMainViewComponent } from './users-main-view/users-main-view.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UsersService } from './users.service';
import { UsersListViewComponent } from './users-list-view/users-list-view.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  declarations: [AddUserComponent,
    UsersMainViewComponent,
    UsersListViewComponent
  ],
  providers:[UsersService]
})
export class UsersModule { }
