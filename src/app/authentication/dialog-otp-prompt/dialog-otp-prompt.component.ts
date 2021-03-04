import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { AuthenticationService } from '../../services/user/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-dialog-otp-prompt-prompt',
  templateUrl: 'dialog-otp-prompt.component.html',
  styleUrls: ['dialog-otp-prompt.component.scss'],
})
export class DialogOTPPromptComponent implements OnInit, OnDestroy {
  
  private readonly detroy$ = new Subject();

  sendingOTP = false;
  email: string;

  constructor(protected ref: NbDialogRef<DialogOTPPromptComponent>,
              private authService: AuthenticationService,
              private notifications: NbToastrService) {}

  cancel() {
    this.ref.close();
  }

  submit(code) {
    this.sendingOTP = true;
    this.authService.verifyResetPassword(this.email, code)
    .pipe(takeUntil(this.detroy$))
    .subscribe(
      (res: any) => {
        this.sendingOTP = false;
        this.ref.close(res);
      },
      (err: HttpErrorResponse) => {
        this.notifications.show(
          err, 
          'Không thể xác nhân OTP!', 
          {status: `danger`});
      }
    );
    
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
