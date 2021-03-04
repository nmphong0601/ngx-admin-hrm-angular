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
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit, OnDestroy {

  userRole: any;
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
      first_name: {
        title: "Họ và tên đệm",
        type: "string"
      },
      last_name: {
        title: "Tên",
        type: "string"
      },
      birth_date: {
        title: "Ngày sinh",
        type: "string"
      },
      phone: {
        title: "Số điện thoại",
        type: "string"
      },
      jobrole_name: {
        title: "Chức vụ",
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
  staffs: any[] = [];

  constructor(private iconsLibrary: NbIconLibraries,
              private staffService: EmployeeService,
              private datePipe: DatePipe,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService,
              private route: ActivatedRoute) {
                this.iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
                this.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

                //this.iconsLibrary.setDefaultPack('fa');
  }

  loadData() {
    debugger;
    this.loadingStaffs = true;
    this.staffService.all().pipe(takeUntil(this.destroy$))
    .subscribe(
      (results: any) => {
        this.loadingStaffs = false;
        this.staffs = results;
        this.staffs.forEach(employee => {
            employee.department = employee.departments[0];
            employee.jobrole = employee.jobroles[0];

            employee.birth_date = employee.birth_date != undefined ? this.datePipe.transform(employee.birth_date,"dd/MM/yyyy") : null;
            employee.jobrole_name = employee.jobrole.name;

            delete employee.departments;
            delete employee.jobroles;
        });

        this.source.load(this.staffs);
      }, (error: any) => {
        this.loadingStaffs = false;
        this.showToast('danger', 'Lỗi lấy danh sách nhân viên!');
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userRole = +params['role'];
   });
    this.loadData();
  }

  btnClickAdd() {
    let newEmployee = new Employee();

    this.dialogService.open(DialogEmployeePromptComponent, { 
      context: {
        title: 'Thêm mới nhân viên',
        userDetails: newEmployee
      } 
    }).onClose.subscribe(
      (user: Employee) => {
        if(user != null){
          this.loadData();
        }
      }
    );
  }

  btnClickEdit(event) {
    let editEmployee = new Employee(event.data);

    this.dialogService.open(DialogEmployeePromptComponent, { 
      context: {
        title: 'Cập nhật nhân viên',
        userDetails: editEmployee
      } 
    }).onClose.subscribe(
      (user: Employee) => {
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
