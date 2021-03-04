import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDateService, NbToastrService } from '@nebular/theme';
import { Employee } from '../../../services/employee/employee.model';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Subject } from 'rxjs';
import { format, compareAsc } from 'date-fns'

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
  userDetails: Employee;

  constructor(protected ref: NbDialogRef<DialogEmployeePromptComponent>,
              private staffService: EmployeeService,
              private fb: FormBuilder,
              private dateService: NbDateService<Date>,
              private toastrService: NbToastrService) {
                this.maxBirthDate = this.dateService.createDate(this.dateService.today().getFullYear() - 18,0,1);
              }

  createForm() {
    this.employeeForm = this.fb.group({
      firstName: [this.userDetails.first_name, Validators.required],
      lastName: [this.userDetails.last_name, Validators.required],
      birthDate: this.userDetails.birth_date && this.convertDate(this.userDetails.birth_date) || this.maxBirthDate,
      gender: this.userDetails.gender || 'Nam',
      phone: this.userDetails.phone || null,
      address: this.userDetails.address || null,
      email: [this.userDetails.email, Validators.required]
    });
  }

  convertDate(dateString: string) {
    const arrDateString: string[] = dateString.split('/');
    const date = this.dateService.createDate(+arrDateString[2], +arrDateString[1], +arrDateString[0]);
    // const date = this.dateService.format(new Date(+arrDateString[2],+arrDateString[1],+arrDateString[0]), 'MM\dd\yyyy' );
    return date;
  }

  cancel() {
    this.ref.close();
  }

  add(formData) {
    this.staffService.all().pipe(takeUntil(this.destroy$),
      mergeMap(
        (results: any) => {
          const arr: [] = results;
          formData.birthDate = this.dateService.format(formData.birthDate, "yyyy-MM-dd");
          return this.staffService.add(formData);
        }
      ),
      finalize(() =>{})
    )
    .subscribe(
      (results: any) => {
        this.submitting = false;

        this.showToast('success', "Thêm mới thành công!");
        this.ref.close(formData);
      },
      (error: HttpErrorResponse) => {
        this.submitting = false;

        this.showToast('danger', `Thêm mới thất bại! ${error}`);
      }
    );
  }

  update(formData) {
    formData.staffId = this.userDetails.oid;
    this.staffService.update(formData).pipe(takeUntil(this.destroy$))
    .subscribe(
      (success: any) => {
        this.submitting = false;

        this.showToast('success', "Cập nhật thành công!");
        this.ref.close(formData);
      },
      (error: HttpErrorResponse) => {
        this.submitting = false;

        this.showToast('danger', "Cập nhật thất bại!");
      }
    );
  }

  showToast(status, message) {
    this.toastrService.show(
      message || 'Xử lý thành công!',
      status || 'Success',
      {status});
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
  }
}
