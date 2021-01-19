import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router  ) { }

  async canActivate(state: RouterStateSnapshot) {
    let currentUrl = state.url
    let user = await localStorage.getItem('user')
    if (user != undefined || user != null) {
      if (currentUrl === "/login") {
        this.router.navigate(['/home']);
        return false
      }
      return true;
    } else {
      if (currentUrl === "/login") {
        return true
      }
      this.router.navigate(['/login']);

      return false;
    }

  }
}
