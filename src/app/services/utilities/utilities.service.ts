import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { environment } from '../../../environments/environment';
import { throwError as _throw, throwError, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError, takeUntil } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';

declare var Date: any;
@Injectable({
  providedIn: "root"
})
export class UtilitiesService {
  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;
  private EMP_URL = environment.BASE_URL + 'api/v1/employees';
  public today = Date()
    .replace(/[a-zA-Z]|\s/g, "")
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
  randomNumber: any;
  user: any;
  // Observable: Investments Stattus
  private chargesSource = new Subject<any>();
  charges$ = this.chargesSource.asObservable();
  private chargesErrorSource = new Subject<string>();
  chargesError$ = this.chargesErrorSource.asObservable();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cp: CurrencyPipe
  ) {}

  generateNumber() {
    this.randomNumber = null;
    this.randomNumber =
      environment.APP_NAME +
      this.today +
      Math.floor(Math.random() * (999999999 - 10000000 + 1) + 10000000);
    return this.randomNumber;
  }

  formatDate(dateObj) {
    let newFormat: any = '';
    if (dateObj) {
      dateObj.day = this.addzero(dateObj.day);
      dateObj.month = this.addzero(dateObj.month);
      newFormat = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    }

    return newFormat;
  }

  addzero(value) {
    let formated = value.toString();
    if (formated.length === 1) {
      formated = '0' + value;
    }
    return formated;
  }

  handleError(error?: HttpErrorResponse) {
    debugger;
    let errormessage = null;

    if (error.error instanceof ErrorEvent) {
      console.error("Network Error", error.error.message);
      errormessage = `Network Error ${error.error.message}`;
      console.log(errormessage);
    } else {
      console.error(
        `Backend returned code ${error.status},` +
          `body was: ${JSON.stringify(error.error.responseDescription)}`
      );
      if (error.statusText === "Unknown Error") {
        errormessage = "Opps! We are sorry. Our service is currently down. Please try *737# or use our GT Mobile app.";
      }
      errormessage = `${error.error.responseDescription || errormessage}`;
      console.log(errormessage);
    }
    console.log(errormessage);
    return throwError(`${errormessage.slice(errormessage.indexOf("-") + 1)}`);
  }

  handleResponseError(res) {
    let message = res.responseDescription;
    switch (res.responseCode) {
      case '01':
        {
          message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        }
        break;

      case '96':
        {
          message = (message) ? message.slice(message.indexOf('-') + 1) : '';
          console.log(message);
        }
        break;

      case '03':
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;

      case '38':
        {
          message = message.slice(message.indexOf('-') + 1);
          setTimeout(() => {
            this.router.navigate(['/authentication/login']);
          }, 5000);
        }
        break;

      case '25':
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;

      case '99':
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;

      default:
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;
    }

    return message;
  }
}
