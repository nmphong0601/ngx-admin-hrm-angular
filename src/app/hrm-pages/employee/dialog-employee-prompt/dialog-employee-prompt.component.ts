import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDateService, NbToastrService } from '@nebular/theme';
import { User } from '../../../services/user/user.model';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-dialog-employee-prompt',
  templateUrl: 'dialog-employee-prompt.component.html',
  styleUrls: ['dialog-employee-prompt.component.scss'],
  providers:[FormBuilder]
})
export class DialogEmployeePromptComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  submitting = false;
  maxBirthDate: Date;
  employeeForm: FormGroup

  title: string;
  userDetails: User;

  constructor(protected ref: NbDialogRef<DialogEmployeePromptComponent>,
              private staffService: EmployeeService,
              private fb: FormBuilder,
              private dateService: NbDateService<Date>,
              private toastrService: NbToastrService) {
                this.maxBirthDate = this.dateService.createDate(this.dateService.today().getFullYear() - 18,0,1);
              }

  createForm() {
    debugger;
    this.employeeForm = this.fb.group({
      firstName: [this.userDetails.firstName, Validators.required],
      lastName: [this.userDetails.lastName, Validators.required],
      birthDate: this.userDetails.birthDate !== "" && this.convertDate(this.userDetails.birthDate) || this.maxBirthDate,
      gender: this.userDetails.gender,
      phone: this.userDetails.phone,
      address: this.userDetails.address,
      email: [this.userDetails.email, Validators.required]
    });
  }

  convertDate(dateString: string) {
    const arrDateString: string[] = dateString.split('/');
    const date = this.dateService.createDate(+arrDateString[2], +arrDateString[1], +arrDateString[0]);
    return date;
  }

  cancel() {
    this.ref.close();
  }

  add(formData) {
    debugger;
    this.staffService.all().pipe(takeUntil(this.destroy$),
      mergeMap(
        (success: any) => {
          const arr: [] = success.content;
          const code = Math.max.apply(Math, arr.map(function(o: any) { return o.staffId; })) + 1;
          formData.staffId = code;
          formData.birthDate = this.dateService.format(formData.birthDate, "yyyy-MM-dd");
          return this.staffService.add(formData);
        }
      ),
      finalize(() =>{})
    )
    .subscribe(
      (success: any) => {
        this.submitting = false;

        this.showToast('success', "Thêm mới thành công!");
        this.ref.close(formData);
      },
      (error: HttpErrorResponse) => {
        this.submitting = false;

        this.showToast('error', `Thêm mới thất bại! ${error}`);
      }
    );
  }

  update(formData) {
    formData.staffId = this.userDetails.staffId;
    this.staffService.update(formData).pipe(takeUntil(this.destroy$))
    .subscribe(
      (success: any) => {
        this.submitting = false;

        this.showToast('success', "Cập nhật thành công!");
        this.ref.close(formData);
      },
      (error: HttpErrorResponse) => {
        this.submitting = false;

        this.showToast('error', "Cập nhật thất bại!");
      }
    );
  }

  showToast(status, message) {
    this.toastrService.show(
      status || 'Success',
      message || 'Xử lý thành công',
      {status});
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
  }
}
