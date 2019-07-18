import { Component, OnInit, Input, } from '@angular/core';

@Component({
  selector: 'app-users-list-view',
  templateUrl: './users-list-view.component.html',
  styleUrls: ['./users-list-view.component.css']
})
export class UsersListViewComponent implements OnInit {
  @Input() userList:Array<any>
  constructor() { 
  }

  ngOnInit() {
  }

}
