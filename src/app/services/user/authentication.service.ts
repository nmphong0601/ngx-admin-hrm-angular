import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private authApiUrl = 'api/v1/users';

    constructor(private http: HttpClient, private router: Router) {
        
    }

    login(credentials): Observable<any> {
        console.log(credentials);
        const loginData = {
          username: credentials.Username,
          password: credentials.Password,
        };
        const PATH = this.authApiUrl + `/authenticate`;
        return this.http.post<any>(PATH, JSON.stringify(loginData))
        .pipe(
          //retry(3),
          //catchError(this.util.handleError)
        );
      }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.clear();
        localStorage.clear();
        
        this.router.navigate(['authentication'])
    }

    forgotPassword(email): Observable<any>{
        const PATH = this.authApiUrl + `/forgot`;
        return this.http.post<any>(PATH, JSON.stringify({email: email}))
        .pipe(
          //retry(3),
          //catchError(this.util.handleError)
        );
      }
      verifyResetPassword(email, code): Observable<any> {
        const PATH = this.authApiUrl + `/otp-verify`;
  
        return this.http.post<any>(PATH, JSON.stringify({email: email, code: code}))
        .pipe();
      }
  
      getToken(): string {
        let token = JSON.parse(sessionStorage.getItem('token'));
  
        // if(token){
        //   this.verifyToken(token).pipe(untilDestroyed(this)).subscribe(
        //     (res: any) => {
        //       return token;
        //     },
        //     (err: HttpErrorResponse) => {
        //       if(err.status === 401 && localStorage.getItem('refreshToken')){
        //         let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
        //         this.verifyToken(refreshToken)
        //         .pipe(untilDestroyed(this)).subscribe(
        //           (res: any) => {
        //             localStorage.setItem("token", JSON.stringify(res.accessToken));
        //             localStorage.setItem("refreshToken", JSON.stringify(res.refreshToken));
    
        //             token = JSON.parse(localStorage.getItem('token'));
        //             return token;
        //           }
        //         )
        //       }
        //     }
        //   );
        // }
  
        return token;
    }
  
      verifyToken(token):Observable<any> {
        const PATH = this.authApiUrl + `/refresh-token`;
        return this.http.post<any>(PATH, JSON.stringify({token: token}))
        .pipe(
          //retry(3),
          //catchError(this.util.handleError)
        );
    }

    clearLocalStorage() {
        localStorage.clear();
    }
    clearSessionStorage() {
        localStorage.clear();
    }
      
}