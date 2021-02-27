import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChange, ChangeDetectionStrategy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Employee } from '../../services/employee/employee.model';

@Component({
  selector: 'ngx-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {
  showResult: boolean = false;

  @Input() disabled: boolean = false;

  @Input() loading: boolean = false;
  @Output() loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() keywork: string = "";
  @Output() keyworkChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() valueshow: string = "";
  @Output() valueshowChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeholder: string;
  @Input() dataSource: string;

  @Input() response: any = null;
  @Output() responseChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() callBackFunc: EventEmitter<any> = new EventEmitter<any>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  keyworkChanged(event){
    this.keyworkChange.emit(this.keywork);
    
    this.loading = true;
    this.loadingChange.emit(this.loading);
    
    this.httpClient.get<any>(this.dataSource + `${this.keywork}`).pipe(retry(3))
    .subscribe(
      (res: any) => {
        this.response = res;

        this.loading = false;
        this.loadingChange.emit(this.loading);
        this.valueshowChange.emit(this.valueshow);
        this.callBackFunc.emit(this.response);

        this.showResult = true;
      },
      (err: HttpErrorResponse) => {
        this.response = null;

        this.loading = false;
        this.loadingChange.emit(this.loading);
        this.callBackFunc.emit(this.response);

        this.showResult = false;
      }
    );
  }

  selectResult() {
    this.showResult = false;
  }

}
