import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogPayrollPromptComponent } from './dialog-payroll-prompt/dialog-payroll-prompt.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Payroll } from '../../services/payroll/payroll.model';
import { PayrollService } from '../../services/payroll/payroll.service';

import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayrollComponent implements OnInit, OnDestroy {

  loadingPayrolls: boolean = false;
  private readonly destroy$ = new Subject();

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: false
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      employee_name: {
        title: "Nhân viên",
        type: "string"
      },
      jobrole_name: {
        title: "Chức vụ",
        type: "string"
      },
      salary: {
        title: "Lương cơ bản",
        type: "string"
      },
      bonus: {
        title: "Thưởng",
        type: "string"
      },
      status: {
        title: "Trạng thái",
        type: "string"
      }
    },
    actions: {
      columnTitle: "Thao tác",
      add: false,
      edit: true,
      delete: false,
      custom: [
        { name: "send", title: '<i class="nb-email" ngIf=""></i>' },
        { name: "print", title: '<i class="nb-printer" ngIf=""></i>' }
      ]
    },
    rowClassFunction: row => {
      return "show-all" //Hiện tất cả nút
    },
    attr: {
      class: "table"
    },
    hideSubHeader: true
  };

  loadingpayroll = false;
  source: LocalDataSource = new LocalDataSource();
  payrolls: any[] = [];

  constructor(private iconsLibrary: NbIconLibraries,
              private payrollService: PayrollService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) {
                this.iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

                //this.iconsLibrary.setDefaultPack('fa');
  }

  loadData() {
    this.loadingPayrolls = true;
    this.payrollService.all().pipe(takeUntil(this.destroy$))
    .subscribe(
      (results: any) => {
        this.loadingPayrolls = false;
        this.payrolls = results;
        this.payrolls.forEach(payroll => {
          payroll.employee = payroll.employees[0];
          payroll.employee_name = `${payroll.employee.first_name} ${payroll.employee.last_name}`;
          switch(payroll.status){
            case 0:
              payroll.status = "Chưa duyệt"
              break;
            case 1:
              payroll.status = "Đã duyệt"
              break;
          }
          delete payroll.employees;
      });
        this.source.load(this.payrolls);
      }, (error: any) => {
        this.loadingPayrolls = false;
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }

  btnClickAdd() {
    let newPayroll = new Payroll();

    this.dialogService.open(DialogPayrollPromptComponent, { 
      context: {
        title: 'Thêm mới lương',
        payrollDetails: newPayroll
      } 
    }).onClose.subscribe(
      (Payroll: Payroll) => {
        if(Payroll != null){
          this.loadData();
        }
      }
    );
  }

  btnClickEdit(event) {
    let editPayroll = new Payroll(event.data);

    this.dialogService.open(DialogPayrollPromptComponent, { 
      context: {
        title: 'Cập nhật lương',
        payrollDetails: editPayroll
      } 
    }).onClose.subscribe(
      (Payroll: Payroll) => {
        if(Payroll != null){
          this.loadData();
        }
      }
    );
  }

  btnClickDelete(event) {
    if (window.confirm("Bạn có chắc chắn muốn xóa lương của người này không?")) {
      this.loadingpayroll = true;
      this.payrollService
        .remove(event.data.payrollId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.loadingpayroll = false;
            
            this.showToast('success', "Xóa thành công!");
            event.confirm.resolve();

            this.loadData();
          },
          (err: any) => {
            this.loadingpayroll = false;
            
            this.showToast('danger', `Xóa không thành công! ${err}`);
            event.confirm.reject();
          }
        );
    } else {
      event.confirm.reject();
    }
  }

  showToast(status, message) {
    this.toastrService.show(
      message || 'Xử lý thành công',
      status || 'Success',
      {status});
  }

  ngOnDestroy() {

  }

}
