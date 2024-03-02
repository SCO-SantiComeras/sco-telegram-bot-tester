import { FormsService } from './../../../../shared/forms/forms.service';
import { FormsError } from './../../../../shared/forms/forms-errors.model';
import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { Login } from '../../model/login';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Store } from '@ngxs/store';
import { LogIn } from '../../store/auth.actions';
import { AuthState } from '../../store/auth.state';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public loginForm: FormGroup;
  public formErrors: FormsError[];
  public hidePassword: boolean;
  
  constructor(
    private readonly router: Router,
    public readonly resolutionService: ResolutionService,
    private readonly translateService: TranslateService,
    public readonly formsService: FormsService,
    private readonly store: Store,
    private readonly toast: ToastService,
    private readonly spinnerService: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.hidePassword = true;
    this.formErrors = [];
  }

  ngOnDestroy(): void {
    this.loginForm.reset();
  }

  onClickSubmit() {
    const login: Login = this.loginForm.value;

    this.validateFormValues(login);
    if (this.formErrors && this.formErrors.length > 0) {
      return;
    }

    this.spinnerService.showSpinner();
    this.store.dispatch(new LogIn({ login: { name: login.name, password: login.password } })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();
        
        const success: boolean = this.store.selectSnapshot(AuthState.success);
        if (!success) {
          this.toast.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          return;
        }

        this.toast.addSuccessMessage(this.store.selectSnapshot(AuthState.successMsg));
        this.router.navigateByUrl('');
      },
      error: () => {
        this.spinnerService.hideSpinner();

        this.toast.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
      }
    })
  }

  private validateFormValues(login: Login) {
    this.formErrors = [];

    if (!login.name) {
      this.formErrors.push({ 
        formControlName: 'name', 
        error: this.translateService.getTranslate('label.login.component.form.validate.name')
      });
    }

    if (!login.password) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.login.component.form.validate.password')
      });
    }

    if (login.password && (login.password.length < 8 || login.password.length > 30)) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.login.component.form.validate.password.length')
      });
    }

    const pwdPatter: any = new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);
    if (login.password && !pwdPatter.test(login.password)) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.login.component.form.validate.password.pattern')
      });
    }

    this.loginForm = this.formsService.setErrors(this.loginForm, this.formErrors);
  }

  onClickForgotPassword() {
    this.router.navigateByUrl("request-password");
  }

  onCLickRegisterUser() {
    this.router.navigateByUrl("signup");
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key != 'Enter') {
      return;
    }

    this.hidePassword = true;
    this.onClickSubmit();
  }
}
