import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-projects-list-view',
  templateUrl: './projects-list-view.component.html',
  styleUrls: ['./projects-list-view.component.css']
})
export class ProjectsListViewComponent implements OnInit,AfterContentChecked {
  @Input() projectList: Array<any>
  constructor() { }

  ngOnInit() {

  }

  ngAfterContentChecked() {
    if(this.projectList){
      let todayDate = new Date();
      this.projectList.forEach((project) => {
        let isCompleted = project.endDate != null && new Date(project.endDate).getTime() <= todayDate.getTime();
         _.assign(project, {completedText: isCompleted ? "Yes" : project.startDate == null ? "Yet to start" : "No"});
      });
    }
  }

}
