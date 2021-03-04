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
      employee: {
        title: "Nhân viên",
        type: "string"
      },
      jobRole: {
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
      delete: true
    },
    hideSubHeader: true
  };

  loadingpayroll = false;
  source: LocalDataSource = new LocalDataSource();
  payrolls: Payroll[] = [];

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
      (success: any) => {
        this.loadingPayrolls = false;
        this.payrolls = success.content;
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
    debugger;
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
    this.dialogService.open(DialogPayrollPromptComponent, { 
      context: {
        title: 'Cập nhật lương',
        payrollDetails: event.data
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
