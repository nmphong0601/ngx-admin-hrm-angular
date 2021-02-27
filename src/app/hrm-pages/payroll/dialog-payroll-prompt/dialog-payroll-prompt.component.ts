import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDateService, NbToastrService } from '@nebular/theme';
import { Payroll } from '../../../services/payroll/payroll.model';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { mergeMap, finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-dialog-payroll-prompt',
  templateUrl: 'dialog-payroll-prompt.component.html',
  styleUrls: ['dialog-payroll-prompt.component.scss'],
  providers:[FormBuilder]
})
export class DialogPayrollPromptComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  submitting = false;
  maxBirthDate: Date;
  payrollForm: FormGroup;

  title: string;
  payrollDetails: Payroll;

  constructor(protected ref: NbDialogRef<DialogPayrollPromptComponent>,
              private staffService: EmployeeService,
              private fb: FormBuilder,
              private dateService: NbDateService<Date>,
              private toastrService: NbToastrService) {
                this.maxBirthDate = this.dateService.createDate(this.dateService.today().getFullYear() - 18,0,1);
              }

  createForm() {

    this.payrollForm = this.fb.group({
      salary: [this.payrollDetails.salary, Validators.required],
      bonus: [this.payrollDetails.bonus, Validators.required],
      status: [this.payrollDetails.status, Validators.required]
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
    formData.oid = this.payrollDetails.oid;
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
