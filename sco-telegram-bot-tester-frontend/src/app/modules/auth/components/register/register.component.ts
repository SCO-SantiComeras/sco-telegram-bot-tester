import { SpinnerService } from './../../../../shared/spinner/spinner.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { FormsService } from './../../../../shared/forms/forms.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { FormsError } from './../../../../shared/forms/forms-errors.model';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RegisterUser } from '../../store/auth.actions';
import { AuthState } from '../../store/auth.state';
import { User } from '../../../users/model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public formErrors: FormsError[];
  public hidePassword: boolean;
  public hidePasswordConfirm: boolean;
  
  constructor(
    private readonly router: Router,
    public readonly resolutionService: ResolutionService,
    private readonly translateService: TranslateService,
    public readonly formsService: FormsService,
    private readonly store: Store,
    private readonly toast: ToastService,
    private readonly spinnerService: SpinnerService,
  ) { 
    this.hidePassword = true;
    this.hidePasswordConfirm = true;
  }

  ngOnInit(): void {
    this.registerUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });

    this.formErrors = [];
    this.hidePassword = true;
    this.hidePasswordConfirm = true;
  }

  ngOnDestroy(): void {
    this.registerUserForm.reset();
  }

  onClickSubmit() {
    const form: User = this.registerUserForm.value;

    this.validateFormValues(form);
    if (this.formErrors && this.formErrors.length > 0) {
      return;
    }
    
    form.active = false;

    this.spinnerService.showSpinner();
    this.store.dispatch(new RegisterUser({ user: form })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(AuthState.success);
        if (!success) {
          this.toast.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
          return;
        }

        this.toast.addSuccessMessage(this.store.selectSnapshot(AuthState.successMsg));
        this.router.navigateByUrl("login");
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toast.addErrorMessage(this.store.selectSnapshot(AuthState.errorMsg));
      }
    })
  }

  private validateFormValues(form: User) {
    this.formErrors = [];

    if (!form.name) {
      this.formErrors.push({ 
        formControlName: 'name', 
        error: this.translateService.getTranslate('label.register.component.form.validate.name')
      });
    }

    if (form.name && (form.name.length < 4 || form.name.length > 15)) {
      this.formErrors.push({ 
        formControlName: 'name', 
        error: this.translateService.getTranslate('label.register.component.form.validate.name.length')
      });
    }

    const pwdPatter: any = new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);

    if (!form.password) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.register.component.form.validate.password')
      });
    }

    if (form.password && (form.password.length < 8 || form.password.length > 30)) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.register.component.form.validate.password.length')
      });
    }

    if (form.password && !pwdPatter.test(form.password)) {
      this.formErrors.push({ 
        formControlName: 'password', 
        error: this.translateService.getTranslate('label.register.component.form.validate.password.pattern')
      });
    }

    if (!form["confirm"]) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.register.component.form.validate.confirm')
      });
    }

    if (form["confirm"] && (form["confirm"].length < 8 || form["confirm"].length > 30)) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.register.component.form.validate.confirm.length')
      });
    }

    if (form["confirm"] && !pwdPatter.test(form["confirm"])) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.register.component.form.validate.confirm.pattern')
      });
    }

    if (form["confirm"] != form.password) {
      this.formErrors.push({ 
        formControlName: 'confirm', 
        error: this.translateService.getTranslate('label.register.component.form.validate.confirm.equals')
      });
    }

    if (!form.email) {
      this.formErrors.push({ 
        formControlName: 'email', 
        error: this.translateService.getTranslate('label.register.component.form.validate.email')
      });
    }

    const emailPattern: any = new RegExp(/.+@.+\..+/);
    if (form.email && !emailPattern.test(form.email)) {
      this.formErrors.push({ 
        formControlName: 'email', 
        error: this.translateService.getTranslate('label.register.component.form.validate.email.pattern')
      });
    }

    this.registerUserForm = this.formsService.setErrors(this.registerUserForm, this.formErrors);
  }

  onClickGoLogin() {
    this.router.navigateByUrl('login');
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key != 'Enter') {
      return;
    }

    this.hidePassword = true;
    this.hidePasswordConfirm = true;
    this.onClickSubmit();
  }
}
