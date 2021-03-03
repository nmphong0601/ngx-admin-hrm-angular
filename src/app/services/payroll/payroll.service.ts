import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Payroll } from './payroll.model';
import {Subject} from 'rxjs';
import {Helper} from '../helper';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PayrollService implements OnDestroy {

  /**
   * Web api url
   * @type {string}
   */
  private PayrollApiUrl = environment.BASE_URL + 'api/v1/payrolls';
  private PayrollList = new Subject<any[]>();
  public PayrollList$ = this.PayrollList.asObservable();
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  all(): Observable<any> {
    const PATH = this.PayrollApiUrl;

    return this.http.get<any>(PATH).pipe();
  }

  /**
   * Returns an Observable of type Payroll retrieved via http.get
   *
   */
  getPayrolls() {
    return this.http.get(this.PayrollApiUrl).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe((e:any) => {
      this.PayrollList.next(e);
      });
  }

  /**
   * Add an Payroll by calling http.post
   * @param Payroll
   * @returns {Observable<Payroll>}
   */
  add(Payroll: Payroll): Observable<any> {
    let options = {headers: this.headers};
    return this.http.post(this.PayrollApiUrl, Payroll, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    );
  }
  addPayroll(Payroll: Payroll) {
    let options = {headers: this.headers};
    this.http.post(this.PayrollApiUrl, Payroll, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe(() =>{
      this.getPayrolls();
    });
  }

  /**
   * Update an Payroll by calling http.put
   * @param Payroll
   */
  update(payroll: Payroll): Observable<any> {
    let url = `${this.PayrollApiUrl}/${payroll.oid}`;
    let options = {headers: this.headers};
    return this.http.put(url, Payroll, options).pipe(
      catchError(Helper.handleError)
    );
  }
  updatePayroll(payroll: Payroll) {
    let url = `${this.PayrollApiUrl}/${payroll.oid}`;
    let options = {headers: this.headers};
    return this.http.put(url, Payroll, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Remove an Payroll by calling http.delete
   * @param Payroll
   */
  remove(payroll: Payroll): Observable<any> {
    let url = `${this.PayrollApiUrl}/${payroll.oid}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }
  removePayroll(payroll: Payroll) {
    let url = `${this.PayrollApiUrl}/${payroll.oid}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Simulates a search on the server with callback function
   * @param searchKey
   * @param searchValue
   * @returns {Observable<Payroll[]>}
   */
  search(searchKey: string, searchValue: any)  {
    (searchKey !== '' && searchValue !== '') ?
       this.http.get(this.PayrollApiUrl).pipe(
        map((response:any) => this.searchPayroll(response, searchKey, searchValue)),
        catchError(Helper.handleError)
       ).subscribe((e:any) =>{ 
          this.PayrollList.next(e)
        })
     : this.getPayrolls();
  }


  /**
   * QuickSort
   * @param array
   * @param key
   * @param descending
   */
  sortObjects (array: any[], key: string, descending: boolean)  {

    for (let i = 0; i < array.length; i++) {
      const currVal = array[i][key];
      const currElem = array[i];
      let j = i - 1;
      while ((j >= 0) && Helper.sortDirection(array[j][key], currVal, descending)) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = currElem;
    }
    this.PayrollList.next(array);
  }


  /**
   * Search Payroll by giving a key and value (searchKey all iniaties a full scale search on all elements)
   * @param res
   * @param searchKey
   * @param searchValue
   * @returns {Array}
   */
  private searchPayroll(res: any, searchKey: string, searchValue: any): Payroll[] {
    const data = Helper.extractData(res);
    const foundValues: any[] = [];
    const regex = new RegExp(searchValue, 'gi');

    data.filter(Payroll => {
      // search all keys indiscriminately
      if (searchKey === 'all') {
        const keyArr: any[] = Object.keys(Payroll);
        keyArr.forEach((key: any) => {
          if (Payroll[key].toString().match(regex) && !Helper.inArray(Payroll, foundValues)) {
            foundValues.push(Payroll);
          }
        });
      } else if (Payroll.hasOwnProperty(searchKey) && Payroll[searchKey].toLowerCase().match(regex)) {
        foundValues.push(Payroll);
      }
    });

    return foundValues;
  }

  ngOnDestroy() {
    this.PayrollList.subscribe();
  }



}
