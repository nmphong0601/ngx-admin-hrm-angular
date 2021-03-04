import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {User} from './user.model';
import {Helper} from '../helper';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { retry, catchError, map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { root } from 'rxjs/internal/util/root';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})//https://stackoverflow.com/questions/53571546/angular-7-shared-service-is-not-shared
export class UserService implements OnDestroy {

  private userApiUrl = environment.BASE_URL + 'api/v1/users';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  // Subjects
  private userInfo = new BehaviorSubject<User>(new User());

  // Announced
  userInfo$ = this.userInfo.asObservable();

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) { }

  /**
   * Find a user
   * @param id
   * @returns {Observable<User>}
   */
  get(id?: number): Observable<any> {
    return this.http.get<any>(this.userApiUrl + `/${id}`).pipe(
      map(response => {
        response.employee = response.employees[0];
        delete response.employees;

        return response;
      }),
      catchError(Helper.handleError)
    );
  }

  /**
   * Set user token in db and localSession
   * @param user
   */
  private setToken(user: User): Observable<any> {
    const token: string  = Helper.generateUUID();
    sessionStorage.setItem('hrm-token', token);
    sessionStorage.setItem('userDetails', JSON.stringify(user));

    let url = this.userApiUrl+ `/${user.oid}`;
    let options = {headers: this.headers};

    return this.http.put<any>(url, user, options).pipe(
      map((response: HttpResponse<any>)=> {
        return {authenticated: true, userInfo: user}
      }),
      catchError(Helper.handleError)
    );
  }

  changePassword(formData): Observable<any> {
    let accessToken = this.auth.getToken();
    if(formData.newPass !== formData.confirmPass){
      return throwError("Mật khẩu xác nhận và mật khẩu mới không khớp!");
    }
    
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let body = {
      userId: userDetails.userId,
      email: userDetails.email,
      newPassword: formData.newPass,
      confirmPassword: formData.confirmPass,
      currentPassword: formData.currentPass
    }

    const PATH = this.userApiUrl + `/change-password`;
    return this.http.post<any>(PATH, JSON.stringify(body))
    .pipe(
      retry(3),
      //catchError(this.util.handleError)
    );
  }

  resetPassword(data, token): Observable<any> {
    localStorage.setItem("token", JSON.stringify(token));

    const PATH = this.userApiUrl + `/reset-password`;

    return this.http.post<any>(PATH, JSON.stringify(data))
    .pipe();
  }

  /**
   * Send object to save to subscribers
   * @param object
   */
  saveUser(object: any) {
    this.userInfo.next(object);
  }

  /**
   * Get object from subcribers
   */
  getUser() {
    // let user = sessionStorage.getItem('user-info');
    // this.saveUser(user?JSON.parse(user):null);
    debugger;
    return this.userInfo.asObservable();
  }

  ngOnDestroy() {
    this.userInfo.unsubscribe();
  }
}
