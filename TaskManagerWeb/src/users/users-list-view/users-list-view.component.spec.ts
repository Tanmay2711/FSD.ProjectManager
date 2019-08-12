/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsersListViewComponent } from './users-list-view.component';
import { UsersService } from '../users.service';

describe('UsersListViewComponent', () => {
  let component: UsersListViewComponent;
  let fixture: ComponentFixture<UsersListViewComponent>;
  let userServiceSpy:jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UsersService',['triggerUserEditedEvent']);
    TestBed.configureTestingModule({
      providers:[
        UsersListViewComponent,
        {provide:UsersService,useValue:spy}
      ]
    })
    userServiceSpy = TestBed.get(UsersService);
    component = TestBed.get(UsersListViewComponent);
  });

  it('should create UsersListViewComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should not have userList when created', () => {
    component.ngOnInit();
    expect(component.userList).toBeUndefined();
  });

  it('should call triggerUserEditedEvent method on usersservice when userEditClicked is called',()=> {
    component.userEditClicked({});
    expect(userServiceSpy.triggerUserEditedEvent.calls.count()).toBe(1,'spy method triggerUserEditedEvent should get called once')
  });
});
