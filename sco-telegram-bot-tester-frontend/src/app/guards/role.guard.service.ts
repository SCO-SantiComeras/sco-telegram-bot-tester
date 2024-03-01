import { AuthState } from '../modules/auth/store/auth.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../modules/users/model/user';
import { RoleConstants } from '../modules/users/constants/role.constants';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    let canContinue: boolean = true;

    const user: User = this.store.selectSnapshot(AuthState.loggedUser);
    if (!user || user && !user.role) {
      canContinue = false;
    }

    if (user.role != RoleConstants.ADMIN) {
      canContinue = false;
    }

    if (!canContinue) {
      this.router.navigateByUrl('login');
    }

    return canContinue;
  }
}
