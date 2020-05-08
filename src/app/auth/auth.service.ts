import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.backendUrl + 'users/';

@Injectable({providedIn: 'root'})

export class AuthService {

  private token: string;
  private isAuthenticated = false;
  private userId: string;
  private authStatus = new Subject<boolean>();
  expirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  signUpUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ message: string, token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'sign-up', authData).subscribe(resData => {
      this.authenticateUser(resData.token, resData.userId, resData.expiresIn);
    }, error => {
      this.authStatus.next(false);
    });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', authData).subscribe(resData => {
      this.authenticateUser(resData.token, resData.userId, resData.expiresIn);
    }, error => {
      this.authStatus.next(false);
    });
  }

  autoLogin() {
    const storedData = this.getStoredData();
    if(storedData) {
      const now = new Date();
      const expiresIn = storedData.expDate.getTime() - now.getTime();
      if(expiresIn>0) {
        this.token = storedData.token;
        this.userId = storedData.userId;
        this.isAuthenticated = true;
        this.authStatus.next(true);
        this.setAuthTimer(expiresIn/1000);
      }
    }
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatus.next(false);
    clearTimeout(this.expirationTimer);
    this.clearStoredData();
  }

  private authenticateUser(token: string, userId: string, expiresIn: number) {
    this.token = token;
    this.userId = userId;
    //set token exp timer
    this.setAuthTimer(expiresIn);
    this.isAuthenticated = true;
    this.authStatus.next(true);
    //calculating expiration date:
    const now = new Date();
    const expDate = new Date(now.getTime() + (expiresIn*1000));
    //save token and date in local storage
    this.storeAuthData(this.token, expDate, this.userId);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, duration*1000);
  }

  //local storage functions:
  //-------------------------------------------------------------------------
  private storeAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearStoredData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expDate');
    localStorage.removeItem('userId');
  }

  private getStoredData() {
    const token = localStorage.getItem('token');
    const expDate = new Date(localStorage.getItem('expDate'));
    const userId = localStorage.getItem('userId');
    if(!token || !expDate) {
      return;
    }
    return {
      token: token,
      expDate: expDate,
      userId: userId
    };
  }
  //---------------------------------------------------------------------------
}
