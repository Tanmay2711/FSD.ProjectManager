import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-main-view',
  templateUrl: './project-main-view.component.html',
  styleUrls: ['./project-main-view.component.css']
})
export class ProjectMainViewComponent implements OnInit {
  tempProjectList: Array<any>;
  projectList:Array<any>;
  showSearchControls: boolean;

  constructor(private proejctService:ProjectsService) {

   }

  ngOnInit() {
    this.proejctService.get().subscribe((data : Array<any>) => {
      this.projectList = data;
      this.tempProjectList = data;
      this.showSearchControls = data.length > 0;
    });
  }

  addedProject(project:any){
    console.log("Adding project in main view");
    console.log(project);
    this.projectList.push(project);
    //this.tempProjectList.push(project);
    this.showSearchControls = true;
    this.onKeyUp('');
  }

  onKeyUp(arg0: string) {
    //throw new Error("Method not implemented.");
  }

}
