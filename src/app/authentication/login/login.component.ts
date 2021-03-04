import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from '../../services/user/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/user/authentication.service';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user/user.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../services/employee/employee.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NbGlobalPhysicalPosition, NbToastrService, NbComponentStatus } from '@nebular/theme';

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  providers: [AuthenticationService, UserService],
  styleUrls: [
    "./login.component.scss"
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  logging = false;
  loginForm: FormGroup;
  user: User;
  private readonly destroy$ = new Subject();

  submitted: boolean;
  rememberMe: boolean;
  loginError: string;
  public options = {
    position: ["bottom", "right"]
  };
  redirect: string;
  captchaVerified: string = "";

  constructor(
    private toastrService: NbToastrService,
    private location: Location,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private employeeService: EmployeeService
  ) {

    this.submitted = false;
    this.createForm();
    
    // get return url from route parameters or default to '/'
    this.redirect = this.activeRoute.snapshot.queryParams['redirect'] || '/';
  }

  createForm() {

    this.loginForm = this.fb.group({
      Username: ["", Validators.required],
      Password: ["", Validators.required],
      RememberMe: false
    });
  }

  resolved(captchaResponse: string) {
    this.captchaVerified = captchaResponse;
  }

  onSubmit(formdata) {
    if (formdata.RememberMe === true) {
      localStorage.setItem("userName", formdata.Username);
    }

    this.logging = true;
    this.auth.login(formdata)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          console.log(res);
          // if Login is successful
          sessionStorage.setItem("token", JSON.stringify(res.access_token));
          sessionStorage.setItem("refreshToken", JSON.stringify(res.refresh_token));
          this.getOnboardingJourney(res.user);
          this.logging = false;
        },
        (err: HttpErrorResponse) => {
          this.logging = false;
          this.errorAlert(err === undefined ? "Đăng nhập thất bại!" : "Đăng nhập thất bại! " + err);
          console.log(err);
        }
      );
  }

  // User Authentication
  getOnboardingJourney(user) {
    this.user = new User(user);
    this.storeUserDetails(this.user);
    this.checkUserStatus(this.user);
  }

  storeUserDetails(user) {
    localStorage.setItem("userDetails", JSON.stringify(user));
    this.userService.saveUser(user);
  }

  checkUserStatus(user) {
    this.authenticateUser();
  }

  authenticateUser() {
    let userInfor = JSON.parse(localStorage.getItem('userDetails'));
    if(this.redirect && this.redirect !== '/'){
      window.location.href = this.redirect;
    }
    else{
      switch(userInfor.permission){
        case 'administrator':
          this.router.navigate(['/app'], {queryParams: {role: 'ADMIN'}});
          break;
      }
    }
  }

  shuffleKeyPad(keyArray: any[]) {
    let c = keyArray.length;
    while (c > 0) {
      const i = Math.floor(Math.random() * c);
      c--;
      const t = keyArray[c];
      keyArray[c] = keyArray[i];
      keyArray[i] = t;
    }
    return keyArray;
  }

  errorAlert(messageAlert: any) {
    this.toastrService.show(messageAlert, 'Đăng nhập thất bại', {
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      status: 'danger'
    });
  }

  closeAlert() {
    this.loginError = null;
  }

  addPasswordString(value) {
    let key = this.loginForm.controls["Password"].value;
    key = key + value;
    this.loginForm.controls["Password"].setValue(key);
  }

  clearPasswordString() {
    this.loginForm.controls["Password"].setValue("");
  }

  deletePasswordString() {
    let PwString = this.loginForm.controls["Password"].value;
    PwString = PwString.slice(0, -1);
    this.loginForm.controls["Password"].setValue(PwString);
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    // this.employeeService.getAcctDetailsData();
    this.auth.logout();
  }

  ngOnDestroy(): void {
  }

  getConfigValue(key: string): any {};
}
