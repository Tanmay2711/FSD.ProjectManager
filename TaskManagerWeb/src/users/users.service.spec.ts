/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsersService } from './users.service';
import { of } from 'rxjs';

describe('Service: UsersService Tests', () => {
  let httpClientSpy: { get: jasmine.Spy, post:jasmine.Spy,put:jasmine.Spy, delete:jasmine.Spy };
  let userService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','put','delete']);
    userService = new UsersService(<any> httpClientSpy);
  });

  it('should return expected users and HttpClient get method should called once', () => {
    const expectedUsers: Array<any> =
      [{ 
          userID: 1, 
          firstName: 'Tanmay',
          lastName:'Vartak',
          employeeID:1 
        }, 
        {
          userID: 2, 
          firstName: 'Rohan',
          lastName:'Raut',
          employeeID:2
      }];
  
    httpClientSpy.get.and.returnValue(of(expectedUsers));
  
    userService.get().subscribe(
      users => expect(users).toEqual(expectedUsers, 'Users service should return exact user array which is stubbed'),
      fail
    );

    expect(httpClientSpy.get.calls.count()).toBe(1, 'get method on http client stubb should get called once.');
  });

  it('should return expected user and HttpClient get method should get called once',() => {
    const user = {
      userID: 1, 
      firstName: 'Tanmay',
      lastName:'Vartak',
      employeeID:1 
    };

    httpClientSpy.get.and.returnValue(of(user));
    userService.get().subscribe(
      userData => expect(userData).toEqual(user, 'Users service should return exact user which is stubbed'),
      fail
    );

    expect(httpClientSpy.get.calls.count()).toBe(1, 'get method on http client stubb should get called once.');
  });

  it('should create expected user and HttpClient post method should get called once',()=>{
    const user = {
      userID: 1, 
      firstName: 'Tanmay',
      lastName:'Vartak',
      employeeID:1 
    };

    httpClientSpy.post.and.returnValue(of(user));
    userService.add(user).subscribe(
      userData => expect(userData).toEqual(user, 'Users service should return exact user which is stubbed'),
      fail
    );

    expect(httpClientSpy.post.calls.count()).toBe(1, 'post method on http client stubb should get called once.');
  });

  it('should update expected user and HttpClient put method should get called once',()=>{
    const user = {
      userID: 1, 
      firstName: 'Tanmay',
      lastName:'Vartak',
      employeeID:1 
    };

    httpClientSpy.put.and.returnValue(of(user));
    userService.update(user).subscribe(
      userData => expect(userData).toEqual(user, 'Users service should return exact user which is stubbed'),
      fail
    );

    expect(httpClientSpy.put.calls.count()).toBe(1, 'put method on http client stubb should get called once.');
  });

  it('should delete expected user and HttpClient delete method should get called once',()=>{
    const user = {
      userID: 1, 
      firstName: 'Tanmay',
      lastName:'Vartak',
      employeeID:1 
    };

    httpClientSpy.delete.and.returnValue(of(user));
    userService.remove(user).subscribe(
      userData => expect(userData).toEqual(user, 'Users service should return exact user which is stubbed'),
      fail
    );

    expect(httpClientSpy.delete.calls.count()).toBe(1, 'put method on http client stubb should get called once.');
  });
});
