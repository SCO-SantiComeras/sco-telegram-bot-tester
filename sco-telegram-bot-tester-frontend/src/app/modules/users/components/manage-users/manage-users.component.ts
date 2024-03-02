import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/shared/dialogs/confirm-dialog/model/confirm-dialog-data';
import { cloneDeep } from 'lodash-es';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UsersState } from '../../store/users.state';
import { User } from '../../model/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { TableService } from 'src/app/shared/table/table.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { MatTableDataSource } from '@angular/material/table';
import { CreateUser, DeleteUser, FetchUsers, SubscribeUserWS, UnSubscribeUserWS, UpdateUser } from '../../store/users.actions';
import { ConfirmDialogConstants } from 'src/app/shared/dialogs/confirm-dialog/constants/confirm-dialog.constants';
import { AddEditUsersDialogoData } from 'src/app/shared/dialogs/add-edit-users-dialog/model/add-edit-users-dialog-data';
import { AddEditUsersDialogComponent } from 'src/app/shared/dialogs/add-edit-users-dialog/add-edit-users-dialog.component';
import { AddEditUsersDialogConstants } from 'src/app/shared/dialogs/add-edit-users-dialog/constants/add-edit-users-dialog.constants';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, AfterViewInit, OnDestroy {

  private subManager: Subscription;
  @Select(UsersState.users)
  users$: Observable<User[]>;
  @Select(UsersState.notifyChangeUsers)
  notifyChangeUsers$: Observable<boolean>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns: string[];
  public labelsColumns: any;
  public dataSource: any;

  constructor(
    public readonly dialogService: MatDialog,
    private readonly store: Store,
    private readonly spinnerService: SpinnerService,
    public readonly tableService: TableService,
    private readonly toastService: ToastService,
    private readonly resolutionService: ResolutionService,
    private readonly translateService: TranslateService,
  ) {}

  /* Angular Implements Functions */
  ngOnInit() {
    this.subManager = new Subscription();

    this.displayedColumns  = [
      "name",
      "email", 
      "active", 
      "role", 
      "pwdRecoveryToken", 
      "pwdRecoveryDate", 
      "createdAt",
      "actions",
    ];
    this.labelsColumns = {
      name: this.translateService.getTranslate('label.manage-users.component.cols.name'),
      email: this.translateService.getTranslate('label.manage-users.component.cols.email'),
      active: this.translateService.getTranslate('label.manage-users.component.cols.active'),
      role: this.translateService.getTranslate('label.manage-users.component.cols.role'),
      pwdRecoveryToken: this.translateService.getTranslate('label.manage-users.component.cols.pwdRecoveryToken'),
      pwdRecoveryDate: this.translateService.getTranslate('label.manage-users.component.cols.pwdRecoveryDate'),
      createdAt: this.translateService.getTranslate('label.manage-users.component.cols.createdAt'),
    };
    this.dataSource = new MatTableDataSource<User>();

    this.notifyChangeUsers();
    this.fetcUsers();
  }       

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = this.translateService.getTranslate('label.elements.per.page');
    this.paginator._intl.getRangeLabel = this.tableService.changePaginatorOfLabel();
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
    this.store.dispatch(new UnSubscribeUserWS());
  }

  /* Store Functions */
  notifyChangeUsers(){
    this.store.dispatch(new SubscribeUserWS());
    this.subManager.add(
      this.notifyChangeUsers$.subscribe({
        next: () => {
          this.store.dispatch(new FetchUsers({ filter: undefined }))
        }
      })
    );
  }

  fetcUsers() {
    this.spinnerService.showSpinner();
    this.subManager.add(
      this.users$.subscribe({
        next: () => {
          this.dataSource.data = [];
          const storeUsers: User[] = this.store.selectSnapshot(UsersState.users);

          if (storeUsers && storeUsers.length > 0) {
            this.dataSource.data = cloneDeep(storeUsers);
          }

          this.spinnerService.hideSpinner(); 
        },
        error: () => {
          this.spinnerService.hideSpinner();
        },
      })
    );
  }

  deleteUser(data: User) {
    this.spinnerService.showSpinner();
    this.store.dispatch(new DeleteUser({ name: data.name })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(UsersState.success);
        if (!success) {
          this.toastService.addErrorMessage(this.store.selectSnapshot(UsersState.errorMsg));
          return;
        }
        
        this.toastService.addSuccessMessage(this.store.selectSnapshot(UsersState.successMsg));
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(UsersState.errorMsg));
      }
    })
  }

  createUser(data: User) {
    this.spinnerService.showSpinner();
    this.store.dispatch(new CreateUser({ user: data })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(UsersState.success);
        if (!success) {
          this.toastService.addErrorMessage(this.store.selectSnapshot(UsersState.errorMsg));
          return;
        }
        
        this.toastService.addSuccessMessage(this.store.selectSnapshot(UsersState.successMsg));
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(UsersState.errorMsg));
      }
    })
  }

  updateUser(data: User) {
    this.spinnerService.showSpinner();
    this.store.dispatch(new UpdateUser({ _id: data._id, user: data })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(UsersState.success);
        if (!success) {
          this.toastService.addErrorMessage(this.store.selectSnapshot(UsersState.errorMsg));
          return;
        }
        
        this.toastService.addSuccessMessage(this.store.selectSnapshot(UsersState.successMsg));
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(UsersState.errorMsg));
      }
    })
  }

  /* Table Functions */
  onDeleteElement(data: User) {
    const dialogData: ConfirmDialogData = {
      title: this.translateService.getTranslate('label.manage-users.component.confirm-dialog.title'),
      text: this.translateService.getTranslate('label.manage-users.component.confirm-dialog.text'),
    }

    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: this.resolutionService.getMode() == this.resolutionService.resolutionConstants.MOBILE 
        ? ConfirmDialogConstants.MOBILE_WIDTH 
        : ConfirmDialogConstants.WEB_WIDTH,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.deleteUser(data);
    });
  }

  onAddElement() {
    const dialogData: AddEditUsersDialogoData = {
      title: this.translateService.getTranslate('label.manage-users.component.add-edit-users-dialog.title.add'),
    }

    const dialogRef = this.dialogService.open(AddEditUsersDialogComponent, {
      width: this.resolutionService.getMode() == this.resolutionService.resolutionConstants.MOBILE 
        ? AddEditUsersDialogConstants.MOBILE_WIDTH 
        : AddEditUsersDialogConstants.WEB_WIDTH,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) return;
      this.createUser(result);
    });
  }

  onEditElement(data: User) {
    if (!data) return;

    const dialogData: AddEditUsersDialogoData = {
      title: this.translateService.getTranslate('label.manage-users.component.add-edit-users-dialog.title.update'),
      user: data,
    }

    const dialogRef = this.dialogService.open(AddEditUsersDialogComponent, {
      width: this.resolutionService.getMode() == this.resolutionService.resolutionConstants.MOBILE 
        ? AddEditUsersDialogConstants.MOBILE_WIDTH 
        : AddEditUsersDialogConstants.WEB_WIDTH,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) return;
      this.updateUser(result);
    });
  }
}
