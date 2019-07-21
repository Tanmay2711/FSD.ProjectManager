import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import * as _ from 'lodash';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-projects-list-view',
  templateUrl: './projects-list-view.component.html',
  styleUrls: ['./projects-list-view.component.css']
})
export class ProjectsListViewComponent implements OnInit,AfterContentChecked {
  @Input() projectList: Array<any>
  constructor(private projectService:ProjectsService) { }

  ngOnInit() {

  }

  ngAfterContentChecked() {
    if(this.projectList){
      this.projectList.forEach((project) => {
        let completedTasks = (project.tasks || []).filter((task) => task.status && task.status.toLowerCase() === 'completed').length;
         _.assign(project, {completedText: completedTasks});
      });
    }
  }

  onUpdateProject(projectInfo){
    this.projectService.triggerProjectUpdatedEvent(projectInfo);
  }

}
