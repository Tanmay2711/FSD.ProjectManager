import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { UsersMainViewComponent } from 'src/users/users-main-view/users-main-view.component';
import { ProjectMainViewComponent } from 'src/projects/project-main-view/project-main-view.component';

const routes: Routes = [
  { path: 'viewtask', component: ViewTaskComponent },
  { path: 'addtask', component: AddTaskComponent },
  { path: 'edittask/:taskId', component: AddTaskComponent },
  { path: 'adduser', component: UsersMainViewComponent },
  { path: 'addproject', component: ProjectMainViewComponent },
  { path: '',   redirectTo: '/addproject', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
