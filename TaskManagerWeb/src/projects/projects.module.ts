import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMainViewComponent } from './project-main-view/project-main-view.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectsListViewComponent } from './projects-list-view/projects-list-view.component';
import {MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    AppRoutingModule
  ],
  declarations: [ProjectMainViewComponent,
    AddProjectComponent,
    ProjectsListViewComponent]
})
export class ProjectsModule { }
