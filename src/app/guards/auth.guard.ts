import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../services/user/authentication.service';
import { takeUntil, timeout } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const url: string  = location.origin + state.url;
      let token = JSON.parse(sessionStorage.getItem('token'));
      if (token) {
        let userInfor = JSON.parse(localStorage.getItem('userDetails'));
        
        switch(userInfor.permission){
          case 'administrator':
            state.url.includes("/app") || state.url.includes("/auth") ? null : this.router.navigate(['/app'], {queryParams: {role: 'ADMIN'}});
            break;
        }

        return true;
      }
      this.router.navigate(['auth'], { queryParams: { returnUrl: url }});
      return false;
  }
}
