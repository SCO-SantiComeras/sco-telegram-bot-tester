import { AuthState } from '../modules/auth/store/auth.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Token } from '../modules/auth/model/token';
import { User } from '../modules/users/model/user';
import { ToastService } from '../shared/toast/toast.service';
import { LogOut, ValidateToken } from '../modules/auth/store/auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly toastService: ToastService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const token: Token = this.store.selectSnapshot(AuthState.token);
    const user: User = this.store.selectSnapshot(AuthState.loggedUser);

    if (!token || !user) {
      this.router.navigateByUrl('login');
      return false;
    }

    const validatedToken: boolean =  await new Promise<boolean>(resolve => {
      // Check If User Token Is Not Expired, If Not Expired Refresh User Token
      this.store.dispatch(new ValidateToken({ user: user })).subscribe({
        next: () => {
          const success: boolean = this.store.selectSnapshot(AuthState.success);
          if (success) {
            resolve(true);
            return true;
          }

          this.store.dispatch(new LogOut()).subscribe({
            next: () => {
              resolve(false);
              return false;
            }
          })
        },
        error: () => {
          this.store.dispatch(new LogOut()).subscribe({
            next: () => {
              resolve(false);
              return false;
            }
          })
        }
      })
    });

    if (!validatedToken) {
      this.router.navigateByUrl('login');
      this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
    }

    return validatedToken;
  }
}
