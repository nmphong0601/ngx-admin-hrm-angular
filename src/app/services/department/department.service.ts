import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Department } from './department.model';
import {Subject} from 'rxjs';
import {Helper} from '../helper';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DepartmentService implements OnDestroy {

  /**
   * Web api url
   * @type {string}
   */
  private departmentApiUrl = environment.BASE_URL + 'api/v1/departments';
  private DepartmentList = new Subject<any[]>();
  public DepartmentList$ = this.DepartmentList.asObservable();
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  all(): Observable<any> {
    const PATH = this.departmentApiUrl;

    return this.http.get<any>(PATH).pipe();
  }

  /**
   * Returns an Observable of type Department retrieved via http.get
   *
   */
  getDepartments() {
    return this.http.get(this.departmentApiUrl).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe((e:any) => {
      this.DepartmentList.next(e);
      });
  }

  /**
   * Add an Department by calling http.post
   * @param Department
   * @returns {Observable<Department>}
   */
  add(Department: Department): Observable<any> {
    let options = {headers: this.headers};
    return this.http.post(this.departmentApiUrl, Department, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    );
  }
  addDepartment(Department: Department) {
    let options = {headers: this.headers};
    this.http.post(this.departmentApiUrl, Department, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe(() =>{
      this.getDepartments();
    });
  }

  /**
   * Update an Department by calling http.put
   * @param department
   */
  update(department: Department): Observable<any> {
    let url = `${this.departmentApiUrl}/${department.oid}`;
    let options = {headers: this.headers};
    return this.http.put(url, department, options).pipe(
      catchError(Helper.handleError)
    );
  }
  updateDepartment(department: Department) {
    let url = `${this.departmentApiUrl}/${department.oid}`;
    let options = {headers: this.headers};
    return this.http.put(url, department, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Remove an Department by calling http.delete
   * @param department
   */
  remove(department: Department): Observable<any> {
    let url = `${this.departmentApiUrl}/${department.oid}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }
  removeDepartment(department: Department) {
    let url = `${this.departmentApiUrl}/${department.oid}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Simulates a search on the server with callback function
   * @param searchKey
   * @param searchValue
   * @returns {Observable<Department[]>}
   */
  search(searchKey: string, searchValue: any)  {
    (searchKey !== '' && searchValue !== '') ?
       this.http.get(this.departmentApiUrl).pipe(
        map((response:any) => this.searchDepartment(response, searchKey, searchValue)),
        catchError(Helper.handleError)
       ).subscribe((e:any) =>{ 
          this.DepartmentList.next(e)
        })
     : this.getDepartments();
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
    this.DepartmentList.next(array);
  }


  /**
   * Search Department by giving a key and value (searchKey all iniaties a full scale search on all elements)
   * @param res
   * @param searchKey
   * @param searchValue
   * @returns {Array}
   */
  private searchDepartment(res: any, searchKey: string, searchValue: any): Department[] {
    const data = Helper.extractData(res);
    const foundValues: any[] = [];
    const regex = new RegExp(searchValue, 'gi');

    data.filter(department => {
      // search all keys indiscriminately
      if (searchKey === 'all') {
        const keyArr: any[] = Object.keys(department);
        keyArr.forEach((key: any) => {
          if (department[key].toString().match(regex) && !Helper.inArray(department, foundValues)) {
            foundValues.push(department);
          }
        });
      } else if (department.hasOwnProperty(searchKey) && department[searchKey].toLowerCase().match(regex)) {
        foundValues.push(department);
      }
    });

    return foundValues;
  }

  ngOnDestroy() {
    this.DepartmentList.subscribe();
  }



}
