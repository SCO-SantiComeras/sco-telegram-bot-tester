import { AuthState } from '../modules/auth/store/auth.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Token } from '../modules/auth/model/token';
import { User } from '../modules/auth/model/user';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const token: Token = this.store.selectSnapshot(AuthState.token);
    const user: User = this.store.selectSnapshot(AuthState.loggedUser);


    if (!token || !user) {
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
