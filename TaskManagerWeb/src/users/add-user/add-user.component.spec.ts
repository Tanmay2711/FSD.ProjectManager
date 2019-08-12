/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddUserComponent } from './add-user.component';
import { UsersService } from '../users.service';
import { of, Subject } from 'rxjs';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let userServiceSpy:Partial<UsersService>;

  beforeEach(() => {
    let spy = jasmine.createSpyObj('UsersService',['add','update']);
    Object.assign(spy,{
      userEditedEventSource:new Subject<any>()
    });
    Object.assign(spy,{
      userEditedEvent$:spy.userEditedEventSource.asObservable()
    });
    TestBed.configureTestingModule({
      providers:[
        AddUserComponent,
        {provide:UsersService, useValue:spy}
      ]
    });

    component = TestBed.get(AddUserComponent);
    userServiceSpy = TestBed.get(UsersService);
  });

  it('should create AddUserComponent', () => {
    expect(component).toBeTruthy();
  });
});
