import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse , HttpHeaders } from '@angular/common/http';

import { User } from '../classes/user';
import { Hobby } from '../classes/hobby';

import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  getUser(): Observable<User> {
    return this.http.get<User>('http://localhost:3000/api/user' , {
                        headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                      })
                      .pipe(
                        retry(3),
                        catchError(this.handleError)
                      );
  }

  getHobbies(): Observable<Hobby> {
    return this.http.get<Hobby[]>('http://localhost:3000/api/hobbies' , {
                        headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                      })
                      .pipe(
                        retry(3),
                        catchError(this.handleError)
                      );
  }

  addHobby(formData: Hobby): Observable<object> {
    return this.http.post<object>('http://localhost:3000/api/hobby', formData, {
                      headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                    })
                    .pipe(
                      catchError(this.handleError)
                    );
  }

  handleAddHobbyCallback(response): void {
    if (response.success === true) {
      alert(response.msg);
      window.location.reload();
    } else {
      alert(response.msg);
    }
  }

  handleError(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'server error');
  }

}
