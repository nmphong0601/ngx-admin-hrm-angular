import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Employee} from '../../../services/employee/employee.model';
import {EmployeeService} from '../../../services/employee/employee.service';
// import {PaginatorService} from '../../../services/paginator/paginator.service';
import {ModalDialogComponent} from '../../modal-dialog/modal-dialog.component';
import {ModalService} from '../../../services/modal/modal.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user/user.service';
import {Helper} from '../../../services/helper';
import { User } from '../../../services/user/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-employee-list',
  templateUrl: './employee-list.component.html',
  providers: [ EmployeeService ],
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private router: Router,
              private employeeService: EmployeeService,
              // private paginatorService: PaginatorService,
              private modalService: ModalService) {

  }

  ngOnInit() {
  }

  
  ngOnDestroy() {
  }
}
