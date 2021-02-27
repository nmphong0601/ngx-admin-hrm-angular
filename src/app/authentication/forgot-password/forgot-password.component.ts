import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/user/authentication.service';
import { Location } from '@angular/common';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogOTPPromptComponent } from '../dialog-otp-prompt/dialog-otp-prompt.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  private readonly detroy$ = new Subject();

  forgotPasswordForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  public options = {
    position: ["bottom", "right"]
  };

  constructor(
    private location: Location,
    private route: Router,
    private notifications: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService) {
      this.createForm();
  }

  createForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ["", Validators.required]
    });
  }

  onSubmit(formdata) {
    this.loading = true;

    this.notifications.show({
      message: `Đang gửi yêu cầu lấy lại mật khẩu...`,
      status: `info`
    });

    this.authService.forgotPassword(formdata.email)
      .pipe(takeUntil(this.detroy$))
      .subscribe(
        (res: any) => {
          this.dialogService.open(DialogOTPPromptComponent, { 
            context: {
              email: formdata.email,
            } 
          }).onClose.subscribe(
            (success: any ) => {
              if(success.accessToken){
                const infor = {
                  email: formdata.email,
                  newPassword: "1234567",
                  confirmPassword: "1234567"
                }
                this.userService.resetPassword(infor, success.accessToken).pipe(takeUntil(this.detroy$))
                .subscribe(
                  success => {
                    
                    setTimeout(() => {
                      this.notifications.show({
                        message: `Reset mật khẩu thành công! Mật khẩu mới của bạn là: ${infor.newPassword}`,
                        status: `info`
                      });
                    }, 5000);
                    
                    this.route.navigate(['authentication/login']);
                  },
                  (err: HttpErrorResponse) => {
                    this.notifications.show({
                      message: `Không thể reset mật khẩu! ${err}`,
                      status: `error`
                    });
                  }
                )
              }
            },
            (err: any) => {
              this.notifications.show({
                message: `Không thể reset mật khẩu! ${err}`,
                status: `error`
              });
            })
        },
        (err: HttpErrorResponse) => {
          this.notifications.show({
            message: `Gửi yêu cầu thất bại ${err}`,
            status: `error`
          });
        }
      );
    this.loading = false;
  }

  goBack() {
    this.location.back();
  }

  getConfigValue(key: string): any {};

  ngOnInit() {
    this.authService.clearLocalStorage();
  }

  ngOnDestroy() {
  }

}
