import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private readonly detroy$ = new Subject();

  changePasswordForm: FormGroup;
  loading: boolean;
  submitted: boolean;

  constructor(
    private route: Router,
    private location: Location,
    private notifications: NbToastrService, 
    private fb: FormBuilder, 
    private userService: UserService) {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      currentPass: ["", Validators.required],
      newPass: ["", Validators.required],
      confirmPass: ["", Validators.required]
    });
  }

  onSubmit(formdata) {
    this.loading = true;

    this.notifications.show(
      'Logining...', 
      'Đang cập nhật mật khẩu...', 
      {status: `info`});

    this.userService.changePassword(formdata)
      .pipe(takeUntil(this.detroy$))
      .subscribe(
        (res: any) => {
          this.notifications.show(
            'Mật khẩu đã được đổi thành công', 
            'Đổi mật khẩu thành công!', 
            {status: `info`});

          this.route.navigate(['authentication/login']);
        },
        (err: HttpErrorResponse) => {
          this.errorAlert("Cập nhật thất bại! ", err);
        }
      );
    this.loading = false;
  }

  errorAlert(messageAlert: any, err: any) {
    this.notifications.show(
      err,
      messageAlert,
      {status: `danger`});
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  getConfigValue(key: string): any {};

}
