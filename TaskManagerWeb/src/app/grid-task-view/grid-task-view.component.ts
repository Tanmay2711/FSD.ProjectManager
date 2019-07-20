import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-grid-task-view',
  templateUrl: './grid-task-view.component.html',
  styleUrls: ['./grid-task-view.component.css']
})
export class GridTaskViewComponent implements OnInit {
  @Output() taskEnded = new EventEmitter<any>();
  @Output() newClicked = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Input() taskData :Array<any>
  constructor() { }

  ngOnInit() {
    _.forEach(this.taskData, function(obj) {
      var parentTaskName = (_.find(this.taskData, el => el.tasksID === obj.parentID) || {}).name;
      _.assignIn(obj,{parentTaskName:parentTaskName});
    });

    console.log(this.taskData);
  }

  public endTask(task:any) {
    console.log(task);
    this.taskEnded.emit(task);
  }
    
  public editRecord(record) {
    const clonedRecord = Object.assign({}, record);
    this.editClicked.emit(clonedRecord);

  }

}
