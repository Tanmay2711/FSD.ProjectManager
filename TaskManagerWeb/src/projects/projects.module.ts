import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMainViewComponent } from './project-main-view/project-main-view.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectsListViewComponent } from './projects-list-view/projects-list-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [ProjectMainViewComponent,
    AddProjectComponent,
    ProjectsListViewComponent]
})
export class ProjectsModule { }
