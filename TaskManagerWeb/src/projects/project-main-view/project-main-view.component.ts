import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-project-main-view',
  templateUrl: './project-main-view.component.html',
  styleUrls: ['./project-main-view.component.css']
})
export class ProjectMainViewComponent implements OnInit {
  tempProjectList: Array<any>;
  projectList:Array<any>;
  showSearchControls: boolean;
  searchValue:string = '';
  constructor(private proejctService:ProjectsService) {

   }

  ngOnInit() {
    this.refreshTasks();
  }

  addedProject(project:any){
    this.tempProjectList.push(project);
    this.showSearchControls = true;
    this.onKeyUp();
  }

  editedProject(project:any){
    let index = this.tempProjectList.findIndex(p => p.projectID === project.projectID);
    this.tempProjectList[index] = Object.assign({},project);
    this.onKeyUp();
  }

  refreshTasks(){
    this.proejctService.get().subscribe((data : Array<any>) => {
      this.projectList = data;
      this.tempProjectList = data;
      this.showSearchControls = data.length > 0;
    });
  }

  onKeyUp(){
    this.projectList = this._filter();
  }

  onSeachBtnClick(trigger){
    if(trigger === 'Start Date'){
      this.projectList = _.sortBy(this.projectList, (u) => u.startDate);
    }else if (trigger === 'End Date'){
      this.projectList = _.sortBy(this.projectList, (u) => u.endDate);
    } else if (trigger === 'Priority'){
      this.projectList = _.sortBy(this.projectList, (u) => u.priority);
    } else if (trigger === 'Completed'){

      let tempList =this.projectList.filter((val) => val.endDate!=null);
     
      tempList.sort((a,b)=> {
        return new Date(a.endDate).getTime() > new Date(b.endDate).getTime() ? 1 : -1;
      });
      console.log(tempList);
      tempList.push(...this.projectList.filter((val) => val.endDate == null));
      this.projectList = tempList;
    }
  }

  _filter() {
    return this.tempProjectList.filter(
    project => project.projectName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
    project.priority.toString().includes(this.searchValue.toLowerCase())
  );
  }

}
