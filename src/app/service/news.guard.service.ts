import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NewsGuardService implements CanActivate {

  constructor(
    ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user = JSON.parse(localStorage.getItem('user'))
    let eligible = user.can_add
    if (eligible == true) {
      return true;
    } else {
      return false;
    }
  }
}

