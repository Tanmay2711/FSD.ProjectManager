import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-list-view',
  templateUrl: './users-list-view.component.html',
  styleUrls: ['./users-list-view.component.css']
})
export class UsersListViewComponent implements OnInit {
  @Input() userList:Array<any>
  constructor(private userService:UsersService) { 
  }

  ngOnInit() {
  }

  userEditClicked(userInfo){
    this.userService.triggerUserEditedEvent(userInfo);
  }

}
