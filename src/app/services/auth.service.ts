import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse , HttpHeaders } from '@angular/common/http';

import { User } from '../classes/user';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import {MatSnackBar} from '@angular/material';

const base_url = String(environment.base_url);


@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar) { }

  registerUser(formData: User): Observable<object> {
    return this.http.post<object>(`${base_url}api/register`, formData)
                    .pipe(
                      catchError(this.handleError)
                    );
}

  loginUser(formData: User): Observable<object> {
    return this.http.post<object>(`${base_url}api/login`, formData)
                    .pipe(
                      catchError(this.handleError)
                    );
}

  handleError(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'server error');
  }

  async handleRegisterCallback(response) {
    if (response.success === true) {
      this.openSnackBar('Successfully registered, PLease Log in', 'close');
      this.router.navigate(['/login']);
    } else {
      this.openSnackBar(response.msg, 'close');
    }
  }
  async handleLoginCallback(response) {
    if (response.success === true) {
      this.setToken(response.token);
      this.router.navigate(['/home']);
    } else {
      this.openSnackBar(response.msg, 'close');
    }
  }

  setToken(token): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string {
    if (localStorage.getItem('access_token')) {
      return localStorage.getItem('access_token');
    } else {
      return null;
    }
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    if (this.getToken() !== null) {
      return true;
    }
    return false;
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
