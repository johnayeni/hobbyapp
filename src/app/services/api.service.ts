import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse , HttpHeaders } from '@angular/common/http';

import { User } from '../classes/user';
import { Hobby } from '../classes/hobby';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': this.authService.getToken()
    })
  };


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  getUser(): Observable<User> {
    return this.http.get<User>('http://localhost:3000/api/user' , this.httpOptions)
                      // .retry(3)
                      .catch(this.handleError);
  }

  getHobbies(): Observable<Hobby> {
    return this.http.get<Hobby[]>('http://localhost:3000/api/hobby' , {
                        headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                      })
                      .retry(3)
                      .catch(this.handleError);
  }

  addHobby(formData: Hobby): Observable<Hobby> {
    return this.http.post<Hobby>('http://localhost:3000/api/hobby', formData, {
                      headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                    })
                    .catch(this.handleError);
  }

  handleError(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'server error');
  }

}
