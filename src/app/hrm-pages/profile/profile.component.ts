import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDateService, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../services/user/user.model';
import { EmployeeService } from '../../services/employee/employee.service';

import { NbIconLibraries } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/user/authentication.service';
import { PayrollService } from '../../services/payroll/payroll.service';
import { Payroll } from '../../services/payroll/payroll.model';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {

  loadingInfor: boolean = false;
  private readonly destroy$ = new Subject();

  userInfor: any;
  payrollInfor: any;
  maxBirthDate: Date;

  constructor(private iconsLibrary: NbIconLibraries,
              private userService: UserService,
              private payrollService: PayrollService,
              private authService: AuthenticationService,
              private dateService: NbDateService<Date>,
              private toastrService: NbToastrService) {
                this.maxBirthDate = this.dateService.createDate(this.dateService.today().getFullYear() - 18,0,1);

                this.iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

                //this.iconsLibrary.setDefaultPack('fa');
  }

  loadData() {
    debugger;
    this.loadingInfor = true;
    let userDetail = JSON.parse(localStorage.getItem("userDetails"));
    if(userDetail){
      this.userInfor = new User(userDetail);
      this.userInfor['employee'].birth_date = this.userInfor['employee'].birth_date && this.convertDate(this.userInfor['employee'].birth_date) || this.maxBirthDate;
      this.payrollService.getByEmployee(this.userInfor.employee_oid).pipe(takeUntil(this.destroy$)).subscribe(
        results => {
          this.payrollInfor = new Payroll(results[0]);
        },
        error => {
          this.toastrService.show(
            error, 
            'Không lấy được thông tin bảng lương', 
            {position: NbGlobalPhysicalPosition.TOP_RIGHT,
             status: 'danger'});
        }
      );
    }
    else{
      this.authService.logout();
    }
    this.loadingInfor = false;
  }

  convertDate(dateString: string) {
    const arrDateString: string[] = dateString.split('/');
    const date = this.dateService.createDate(+arrDateString[2], +arrDateString[1], +arrDateString[0]);
    
    return date;
  }

  ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     this.userRole = +params['role'];
  //  });
    this.loadData();
  }

  emailChange(value) {

  }

  updateProfile() {

  }

  updatePassword() {
    
  }

  ngOnDestroy() {

  }

}
