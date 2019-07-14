import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-projects-list-view',
  templateUrl: './projects-list-view.component.html',
  styleUrls: ['./projects-list-view.component.css']
})
export class ProjectsListViewComponent implements OnInit {
  @Input() projectList: Array<any>
  constructor() { }

  ngOnInit() {
  }

}
