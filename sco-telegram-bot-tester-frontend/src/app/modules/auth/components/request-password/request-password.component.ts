import { ToastService } from 'src/app/shared/toast/toast.service';
import { FormsService } from './../../../../shared/forms/forms.service';
import { TranslateService } from '../../../../shared/translate/translate.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsError } from '../../../../shared/forms/forms-errors.model';
import { ResolutionService } from '../../../../shared/resolution/resolution.service';
import { Store } from '@ngxs/store';
import { RequestPassword } from '../../store/auth.actions';
import { AuthState } from '../../store/auth.state';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent implements OnInit, OnDestroy {

  public requestPasswordForm: FormGroup;
  public formErrors: FormsError[];
  
  constructor(
    private readonly router: Router,
    public readonly resolutionService: ResolutionService,
    private readonly translateService: TranslateService,
    public readonly formsService: FormsService,
    private readonly store: Store,
    private readonly toast: ToastService,
    private readonly spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.requestPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });

    this.formErrors = [];
  }

  ngOnDestroy(): void {
    this.requestPasswordForm.reset();
  }

  onClickSubmit() {
    const form: any = this.requestPasswordForm.value;

    this.validateFormValues(form);
    if (this.formErrors && this.formErrors.length > 0) {
      return;
    }

    this.spinnerService.showSpinner();
    this.store.dispatch(new RequestPassword({ email: form.email })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(AuthState.success);
        if (!success) {
          this.toast.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          return;
        }

        this.toast.addSuccessMessage(this.store.selectSnapshot(AuthState.successMsg));
        this.router.navigateByUrl('login');
      },
      error: () => {
        this.spinnerService.hideSpinner();

        this.toast.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
      }
    })
  }

  private validateFormValues(form: any) {
    this.formErrors = [];

    if (!form.email) {
      this.formErrors.push({ 
        formControlName: 'email', 
        error: this.translateService.getTranslate('label.request-password.component.form.validate.email')
      });
    }

    const emailPattern: any = new RegExp(/.+@.+\..+/);
    if (form.email && !emailPattern.test(form.email)) {
      this.formErrors.push({ 
        formControlName: 'email', 
        error: this.translateService.getTranslate('label.request-password.component.form.validate.email.pattern')
      });
    }

    this.requestPasswordForm = this.formsService.setErrors(this.requestPasswordForm, this.formErrors);
  }

  onClickGoLogin() {
    this.router.navigateByUrl('login');
  }

  onClickRegisterUser() {
    this.router.navigateByUrl('signup');
  }
}
