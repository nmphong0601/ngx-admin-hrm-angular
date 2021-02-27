import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogEmployeePromptComponent } from './dialog-employee-prompt/dialog-employee-prompt.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../services/user/user.model';
import { EmployeeService } from '../../services/employee/employee.service';

import { NbIconLibraries } from '@nebular/theme';
import { Employee } from '../../services/employee/employee.model';

@Component({
  selector: 'ngx-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit, OnDestroy {

  loadingStaffs: boolean = false;
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
      firstName: {
        title: "Họ và tên đệm",
        type: "string"
      },
      lastName: {
        title: "Tên",
        type: "string"
      },
      birthDate: {
        title: "Ngày sinh",
        type: "string"
      },
      phone: {
        title: "Số điện thoại",
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

  loadingStaff = false;
  source: LocalDataSource = new LocalDataSource();
  staffs: User[] = [];

  constructor(private iconsLibrary: NbIconLibraries,
              private staffService: EmployeeService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) {
                this.iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

                //this.iconsLibrary.setDefaultPack('fa');
  }

  loadData() {
    this.loadingStaffs = true;
    this.staffService.all().pipe(takeUntil(this.destroy$))
    .subscribe(
      (success: any) => {
        this.loadingStaffs = false;
        this.staffs = success.content;
        this.source.load(this.staffs);
      }, (error: any) => {
        this.loadingStaffs = false;
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }

  btnClickAdd() {
    debugger;
    let newUser = new Employee();

    this.dialogService.open(DialogEmployeePromptComponent, { 
      context: {
        title: 'Thêm mới nhân viên',
        userDetails: newUser
      } 
    }).onClose.subscribe(
      (user: User) => {
        if(user != null){
          this.loadData();
        }
      }
    );
  }

  btnClickEdit(event) {
    this.dialogService.open(DialogEmployeePromptComponent, { 
      context: {
        title: 'Cập nhật nhân viên',
        userDetails: event.data
      } 
    }).onClose.subscribe(
      (user: User) => {
        if(user != null){
          this.loadData();
        }
      }
    );
  }

  btnClickDelete(event) {
    if (window.confirm("Bạn có chắc chắn muốn xóa người này không?")) {
      this.loadingStaff = true;
      this.staffService
        .remove(event.data.staffId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.loadingStaff = false;
            
            this.showToast('success', "Xóa thành công!");
            event.confirm.resolve();

            this.loadData();
          },
          (err: any) => {
            this.loadingStaff = false;
            
            this.showToast('error', `Xóa không thành công! ${err}`);
            event.confirm.reject();
          }
        );
    } else {
      event.confirm.reject();
    }
  }

  showToast(status, message) {
    this.toastrService.show(
      status || 'Success',
      message || 'Xử lý thành công',
      {status});
  }

  ngOnDestroy() {

  }

}
