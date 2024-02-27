import { ConfigService } from './../../../../shared/config/config.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { ConfirmEmail, FetchUserByEmail } from '../../store/auth.actions';
import { AuthState } from '../../store/auth.state';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  public reportIssue: boolean;

  private email: string;
  public user: User;
  public success: boolean;

  constructor(
    public readonly resolutionService: ResolutionService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly configService: ConfigService,
    private readonly store: Store,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
  ) { 
    this.reportIssue = false;

    this.email = undefined;
    this.success = false;
  }

  ngOnInit() {
    this.reportIssue = this.configService.getData('confirmEmailReportIssue') || false;

    this.email = !this.router.url ? '' : this.router.url.split("/")[this.router.url.split("/").length - 1];
    this.success = false;

    if (!this.email || (this.email && this.email.length == 0)) {
      this.location.back();
      return;
    }

    this.spinnerService.showSpinner();
    this.store.dispatch(new FetchUserByEmail({ email: this.email })).subscribe({
      next: () => {
        const success: boolean = this.store.selectSnapshot(AuthState.success);
        if (!success) {
          this.spinnerService.hideSpinner();
          this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          this.location.back();
          return;
        }

        const user: User = this.store.selectSnapshot(AuthState.user);
        if (!user) {
          this.spinnerService.hideSpinner();
          this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          this.location.back();
          return;
        }

        this.user = user;
        if (this.user.active == true) {
          this.location.back();
          return;
        }

        this.activateUser(this.user);
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
        this.location.back();
        return;
      }
    });
  }

  activateUser(user) {
    this.store.dispatch(new ConfirmEmail({ email: this.email })).subscribe({
      next: () => {
        const success: boolean = this.store.selectSnapshot(AuthState.success);
        if (!success) {
          this.spinnerService.hideSpinner();
          this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          this.location.back();
          return;
        }

        const user: User = this.store.selectSnapshot(AuthState.user);
        if (!user) {
          this.spinnerService.hideSpinner();
          this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          this.location.back();
          return;
        }

        this.user = user;
        this.success = true;
        this.spinnerService.hideSpinner();
        this.toastService.addSuccessMessage(this.store.selectSnapshot(AuthState.successMsg));
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
        this.location.back();
        return;
      }
    });
  }

  onClickGoLogin() {
    this.router.navigateByUrl("login");
  }
}