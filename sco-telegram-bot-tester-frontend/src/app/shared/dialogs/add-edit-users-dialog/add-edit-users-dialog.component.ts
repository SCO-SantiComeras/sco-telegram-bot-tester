import { cloneDeep } from 'lodash-es';
import { User } from './../../../modules/users/model/user';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddEditUsersDialogoData } from './model/add-edit-users-dialog-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsError } from '../../forms/forms-errors.model';
import { ResolutionService } from '../../resolution/resolution.service';
import { TranslateService } from '../../translate/translate.service';
import { FormsService } from '../../forms/forms.service';
import { RoleConstants } from 'src/app/modules/users/constants/role.constants';

@Component({
  selector: 'app-add-edit-users-dialog',
  templateUrl: './add-edit-users-dialog.component.html',
  styleUrls: ['./add-edit-users-dialog.component.scss']
})
export class AddEditUsersDialogComponent implements OnInit, AfterViewInit {

  public edit: boolean;
  public user: User;
  public updatePassword: boolean;
  public userActived: boolean;

  public addEditUsersDialogForm: FormGroup;
  public formErrors: FormsError[];
  public hidePassword: boolean;
  public hidePasswordConfirm: boolean;

  public roles: string [];

  constructor(
    public readonly dialogRef: MatDialogRef<AddEditUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditUsersDialogoData,
    public readonly resolutionService: ResolutionService,
    private readonly translateService: TranslateService,
    public readonly formsService: FormsService,
  ) {}

  ngOnInit(): void {
    this.edit = false;
    this.user = new User();
    this.updatePassword = false;
    this.userActived = false;

    this.addEditUsersDialogForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });

    this.formErrors = [];
    this.hidePassword = true;
    this.hidePasswordConfirm = true;

    if (this.data && this.data.user && this.data.user._id) {
      this.edit = true;
      this.user = cloneDeep(this.data.user);

      this.addEditUsersDialogForm.controls.name.setValue(this.user.name);
      this.addEditUsersDialogForm.controls.email.setValue(this.user.email);
      this.addEditUsersDialogForm.controls.role.setValue(this.user.role);
      this.userActived = this.user.active;
    }

    this.roles = [];
    for (const value of Object.values(RoleConstants)) {
      this.roles.push(value);
    }
  }

  ngAfterViewInit(): void {
    this.addEditUsersDialogForm = this.formsService.touchEmptyControls(this.addEditUsersDialogForm);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickSubmit(): void {
    const form: User = this.addEditUsersDialogForm.value;
    
    this.validateFormValues(form);
    if (this.formErrors && this.formErrors.length > 0) {
      return;
    }
    
    if (!this.edit) {
      this.user = cloneDeep(form);
      this.user.active = false;
      this.user.role = RoleConstants.USER;
    } else {
      this.user.name = form.name;
      this.user.email = form.email;
      this.user.password = form.password ? form.password : this.user.password;
      this.user.newPassword = form['confirm'] ? form['confirm'] : this.user.newPassword;
      this.user.role = form.role;
      this.user.active = this.userActived;
    }

    this.dialogRef.close(this.user);
  }
  
  private validateFormValues(form: User) {
    this.formErrors = [];

    if (!form.name) {
      this.formErrors.push({ 
        formControlName: 'name', 
        error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.name')
      });
    }

    if (form.name && (form.name.length < 4 || form.name.length > 15)) {
      this.formErrors.push({ 
        formControlName: 'name', 
        error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.name.length')
      });
    }

    if (!this.edit || this.edit && this.updatePassword) {
      const pwdPatter: any = new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);
      if (!form.password) {
        this.formErrors.push({ 
          formControlName: 'password', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.password')
        });
      }

      if (form.password && (form.password.length < 8 || form.password.length > 30)) {
        this.formErrors.push({ 
          formControlName: 'password', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.password.length')
        });
      }

      if (form.password && !pwdPatter.test(form.password)) {
        this.formErrors.push({ 
          formControlName: 'password', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.password.pattern')
        });
      }

      if (!form["confirm"]) {
        this.formErrors.push({ 
          formControlName: 'confirm', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.confirm')
        });
      }

      if (form["confirm"] && (form["confirm"].length < 8 || form["confirm"].length > 30)) {
        this.formErrors.push({ 
          formControlName: 'confirm', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.confirm.length')
        });
      }

      if (form["confirm"] && !pwdPatter.test(form["confirm"])) {
        this.formErrors.push({ 
          formControlName: 'confirm', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.confirm.pattern')
        });
      }

      if (form["confirm"] != form.password) {
        this.formErrors.push({ 
          formControlName: 'confirm', 
          error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.confirm.equals')
        });
      }
    }

    if (!form.email) {
      this.formErrors.push({ 
        formControlName: 'email', 
        error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.email')
      });
    }

    const emailPattern: any = new RegExp(/.+@.+\..+/);
    if (form.email && !emailPattern.test(form.email)) {
      this.formErrors.push({ 
        formControlName: 'email', 
        error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.email.pattern')
      });
    }

    if (!form.role) {
      this.formErrors.push({ 
        formControlName: 'role', 
        error: this.translateService.getTranslate('label.add-edit-users.dialog.form.validate.role')
      });
    }

    this.addEditUsersDialogForm = this.formsService.setErrors(this.addEditUsersDialogForm, this.formErrors);
  }
}
