import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse , HttpHeaders } from '@angular/common/http';

import { User } from '../classes/user';
import { Hobby } from '../classes/hobby';

import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

import { MatSnackBar } from '@angular/material';

const base_url = String(environment.base_url);


@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, public snackBar: MatSnackBar) { }

  getUser(): Observable<User> {
    return this.http.get<User>(`${base_url}api/user` , {
                        headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                      })
                      .pipe(
                        retry(3),
                        catchError(this.handleError)
                      );
  }

  getHobbies(): Observable<Hobby> {
    return this.http.get<Hobby[]>(`${base_url}api/hobbies` , {
                        headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                      })
                      .pipe(
                        retry(3),
                        catchError(this.handleError)
                      );
  }

  addHobby(formData: Hobby): Observable<object> {
    return this.http.post<object>(`${base_url}api/hobby`, formData, {
                      headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                    })
                    .pipe(
                      catchError(this.handleError)
                    );
  }


  likeHobby(hobby: Hobby): Observable<object> {
    return this.http.put<object>(`${base_url}api/fav-hobby`, hobby , {
                      headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                    })
                    .pipe(
                      catchError(this.handleError)
                    );
  }

  unLikeHobby(hobby: Hobby): Observable<object> {
    return this.http.put<object>(`${base_url}api/unfav-hobby`, hobby , {
                      headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                    })
                    .pipe(
                      catchError(this.handleError)
                    );
  }

  removeHobby(name: string): Observable<object> {
    return this.http.delete(`${base_url}api/hobby/${name}`, {
                      headers: new HttpHeaders().set('Authorization', this.authService.getToken())
                    })
                    .pipe(
                      catchError(this.handleError)
                    );
  }

  handleCallback(response): void {
    this.openSnackBar(response.msg, 'close');
  }

  handleError(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'server error');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
