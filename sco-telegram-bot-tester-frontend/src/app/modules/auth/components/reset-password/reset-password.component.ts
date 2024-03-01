import { FormsError } from './../../../../shared/forms/forms-errors.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { FormsService } from 'src/app/shared/forms/forms.service';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { FetchUserRecoveryPwd, ResetPassword } from '../../store/auth.actions';
import { Location } from '@angular/common';
import { AuthState } from '../../store/auth.state';
import * as moment from 'moment';
import { ConfigService } from 'src/app/shared/config/config.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { User } from '../../../users/model/user';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public resetPasswordForm: FormGroup;
  public formErrors: FormsError[];
  public hidePassword: boolean;
  public hidePasswordConfirm: boolean;

  private pwdRecoveryToken: string;
  private user: User;

  constructor(
    public readonly resolutionService: ResolutionService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly formsService: FormsService,
    private readonly location: Location,
    private readonly configService: ConfigService,
    private readonly spinnerService: SpinnerService,
  ) {
    this.pwdRecoveryToken = undefined;
    this.user = undefined;
  }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
    });

    this.hidePassword = true;
    this.hidePasswordConfirm = true;
    this.formErrors = [];

    this.pwdRecoveryToken = !this.router.url ? '' : this.router.url.split("/")[this.router.url.split("/").length - 1];
    if (!this.pwdRecoveryToken || (this.pwdRecoveryToken && this.pwdRecoveryToken.length == 0)) {
      this.location.back();
      return;
    }

    this.spinnerService.showSpinner();
    this.store.dispatch(new FetchUserRecoveryPwd({ pwdRecoveryToken: this.pwdRecoveryToken })).subscribe({
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
        this.validatePasswordRecoveryDate();
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
        this.location.back();
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.resetPasswordForm.reset();
  }

  onClickSubmit() {
    const resetPassword: any = this.resetPasswordForm.value;

    this.validateFormValues(resetPassword);
    if (this.formErrors && this.formErrors.length > 0) {
      return;
    }

    this.user.password = resetPassword.password;

    this.store.dispatch(new ResetPassword({ pwdRecoveryToken: this.pwdRecoveryToken, user: this.user })).subscribe({
      next: () => {
        const success: boolean = this.store.selectSnapshot(AuthState.success);
        if (!success) {
          this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          return;
        }

        this.toastService.addSuccessMessage(this.store.selectSnapshot(AuthState.successMsg));
        this.router.navigateByUrl("login");
      },
      error: () => {
        this.toastService.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
      }
    })
  }

  private validateFormValues(resetPassword: any) {
    this.formErrors = [];
    const pwdPatter: any = new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);

    if (!resetPassword.password) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.password')
      });
    }

    if (resetPassword.password && (resetPassword.password.length < 8 || resetPassword.password.length > 30)) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.password.length')
      });
    }

    if (resetPassword.password && !pwdPatter.test(resetPassword.password)) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.password.pattern')
      });
    }

    if (!resetPassword.confirm) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.confirm')
      });
    }

    if (resetPassword.confirm && (resetPassword.confirm.length < 8 || resetPassword.confirm.length > 30)) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.confirm.length')
      });
    }

    if (resetPassword.confirm && !pwdPatter.test(resetPassword.confirm)) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.confirm.pattern')
      });
    }

    if (resetPassword.confirm != resetPassword.password) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.reset-password.component.form.validate.confirm.equals')
      });
    }

    this.resetPasswordForm = this.formsService.setErrors(this.resetPasswordForm, this.formErrors);
  }

  onCLickGoLogin() {
    this.router.navigateByUrl("login");
  }

  private validatePasswordRecoveryDate() {
    const tokenExpirationMinutes: number = 
      this.configService.getData(this.configService.configConstants.TOKEN_EXPIRATION_PWD_RECOVERY) || 30;
    const dateNow: Date = new Date();

    const duration = moment.duration(moment(dateNow).diff(moment(this.user.pwdRecoveryDate)));
    const minutes = duration.asMinutes();
    
    if (minutes > tokenExpirationMinutes) {
      this.spinnerService.hideSpinner();
      this.toastService.addErrorMessage(
        this.translateService.getTranslate('label.reset-password.component.form.validate.tokenRecoveryDate')
      );
      this.location.back();
      return;
    }

    this.spinnerService.hideSpinner();
  }
}
