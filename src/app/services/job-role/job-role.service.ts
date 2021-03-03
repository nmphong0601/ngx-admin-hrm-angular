import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { JobRole } from './job-role.model';
import {Subject} from 'rxjs';
import {Helper} from '../helper';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class JobRoleService implements OnDestroy {

  /**
   * Web api url
   * @type {string}
   */
  private JobRoleApiUrl = environment.BASE_URL + 'api/v1/jobroles';
  private JobRoleList = new Subject<any[]>();
  public JobRoleList$ = this.JobRoleList.asObservable();
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  all(): Observable<any> {
    const PATH = this.JobRoleApiUrl;

    return this.http.get<any>(PATH).pipe();
  }

  /**
   * Returns an Observable of type JobRole retrieved via http.get
   *
   */
  getJobRoles() {
    return this.http.get(this.JobRoleApiUrl).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe((e:any) => {
      this.JobRoleList.next(e);
      });
  }

  /**
   * Add an JobRole by calling http.post
   * @param JobRole
   * @returns {Observable<JobRole>}
   */
  add(JobRole: JobRole): Observable<any> {
    let options = {headers: this.headers};
    return this.http.post(this.JobRoleApiUrl, JobRole, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    );
  }
  addJobRole(JobRole: JobRole) {
    let options = {headers: this.headers};
    this.http.post(this.JobRoleApiUrl, JobRole, options).pipe(
      map((response:any) => Helper.extractData(response)),
      catchError(Helper.handleError)
    ).subscribe(() =>{
      this.getJobRoles();
    });
  }

  /**
   * Update an JobRole by calling http.put
   * @param JobRole
   */
  update(jobRole: JobRole): Observable<any> {
    let url = `${this.JobRoleApiUrl}/${jobRole.oid}`;
    let options = {headers: this.headers};
    return this.http.put(url, jobRole, options).pipe(
      catchError(Helper.handleError)
    );
  }
  updateJobRole(jobRole: JobRole) {
    let url = `${this.JobRoleApiUrl}/${jobRole.oid}`;
    let options = {headers: this.headers};
    return this.http.put(url, JobRole, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Remove an JobRole by calling http.delete
   * @param JobRole
   */
  remove(uobRole: JobRole): Observable<any> {
    let url = `${this.JobRoleApiUrl}/${uobRole.oid}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }
  removeJobRole(jobRole: JobRole) {
    let url = `${this.JobRoleApiUrl}/${jobRole.oid}`;
    let options = {headers: this.headers};
    return this.http.delete(url, options).pipe(
      catchError(Helper.handleError)
    );
  }

  /**
   * Simulates a search on the server with callback function
   * @param searchKey
   * @param searchValue
   * @returns {Observable<JobRole[]>}
   */
  search(searchKey: string, searchValue: any)  {
    (searchKey !== '' && searchValue !== '') ?
       this.http.get(this.JobRoleApiUrl).pipe(
        map((response:any) => this.searchJobRole(response, searchKey, searchValue)),
        catchError(Helper.handleError)
       ).subscribe((e:any) =>{ 
          this.JobRoleList.next(e)
        })
     : this.getJobRoles();
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
    this.JobRoleList.next(array);
  }


  /**
   * Search JobRole by giving a key and value (searchKey all iniaties a full scale search on all elements)
   * @param res
   * @param searchKey
   * @param searchValue
   * @returns {Array}
   */
  private searchJobRole(res: any, searchKey: string, searchValue: any): JobRole[] {
    const data = Helper.extractData(res);
    const foundValues: any[] = [];
    const regex = new RegExp(searchValue, 'gi');

    data.filter(JobRole => {
      // search all keys indiscriminately
      if (searchKey === 'all') {
        const keyArr: any[] = Object.keys(JobRole);
        keyArr.forEach((key: any) => {
          if (JobRole[key].toString().match(regex) && !Helper.inArray(JobRole, foundValues)) {
            foundValues.push(JobRole);
          }
        });
      } else if (JobRole.hasOwnProperty(searchKey) && JobRole[searchKey].toLowerCase().match(regex)) {
        foundValues.push(JobRole);
      }
    });

    return foundValues;
  }

  ngOnDestroy() {
    this.JobRoleList.subscribe();
  }



}
