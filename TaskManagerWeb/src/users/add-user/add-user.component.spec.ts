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
  let spy:{add:jasmine.Spy,update:jasmine.Spy,userEditedEventSource:any};
  let userServiceSpy:Partial<UsersService>;

  beforeEach(() => {
    spy = jasmine.createSpyObj('UsersService',['add','update']);
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

  it('should call ngOnInIt',() => {
    component.ngOnInit();
    expect(component.addUserButtonText).toEqual('Add','addUserButtonText should be Add');
  });

  it('should call ngOnInIt and set the formgroup',() => {
    component.ngOnInit();
    expect(component.userForm).toBeTruthy('user form should be created');
    expect(component.formSubmitted).toBeFalsy('formSubmitted property should be false when formgroup is set');
  });

  it('should call resetClicked and set the userInfo property from tempUserInfo',() => {
    component.userInfo = {
      firstName:'Tanmay'
    };
    Object.assign(component.tempUserInfoForEdit,component.userInfo);
    component.userInfo.firstName = 'Rohan';
    component.resetClicked(null);
    expect(component.userInfo.firstName).toEqual(component.tempUserInfoForEdit.firstName,'On Reset Clicked main userinfo property should have all the values from temp model');
    expect(component.userForm).toBeTruthy('user form should be reset');
    expect(component.formSubmitted).toBeFalsy('formSubmitted property should be false when formgroup is set');
  });

  it('should call addOrUpdateUserRecord and should edit the record if userId is > 0',() => {
    let user = {
      userID:1,
      firstName:'Tanmay',
      lastName:'Vartak',
      employeeID:1
    };
    Object.assign(component.userInfo,user);
    Object.assign(component.tempUserInfoForEdit,user);
    component.ngOnInit();
    spy.update.and.returnValue(of(user));
    component.userInfo.lastName = 'Raut';
    component.addOrUpdateUserRecord(null);
    expect(spy.update.calls.count()).toBe(1,'update method on users service should get called once');
    expect(spy.add.calls.count()).toBe(0,'add method on users service should not get called if its edit user');
    expect(component.tempUserInfoForEdit.lastName).toEqual(component.userInfo.lastName,'After successfull update temp user model also should be updated to current user model');
  });

  it('should call addOrUpdateUserRecord and should create the record if userId is  0',() => {
    let user = {
      userID:0,
      firstName:'Tanmay',
      lastName:'Vartak',
      employeeID:1
    };
    Object.assign(component.userInfo,user);
    Object.assign(component.tempUserInfoForEdit,{});
    component.ngOnInit();
    user.userID = 1;
    spy.add.and.returnValue(of(user));
    component.addOrUpdateUserRecord(null);
    expect(spy.add.calls.count()).toBe(1,'add method on users service should get called once');
    expect(spy.update.calls.count()).toBe(0,'update method on users service should not get called in case of add user');
    expect(component.userInfo.userID).toEqual(component.tempUserInfoForEdit.userID,'After successfull addition of user userID of userInfo property should match with temp user model');
  });
});
