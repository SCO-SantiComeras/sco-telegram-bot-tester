import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { cloneDeep } from 'lodash-es';
import { DeleteTelegramBotResult, FetchTelegramBotResults, SubscribeTelegramBotResultsWS, UnSubscribeTelegramBotResultsWS } from './../store/telegram-bot-results.actions';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TelegramBotResultsState } from '../store/telegram-bot-results.state';
import { TelegramBotResult } from '../model/telegram-bot-result';
import { User } from '../../users/model/user';
import { AuthState } from '../../auth/store/auth.state';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableService } from 'src/app/shared/table/table.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/shared/dialogs/confirm-dialog/model/confirm-dialog-data';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { ConfirmDialogConstants } from 'src/app/shared/dialogs/confirm-dialog/constants/confirm-dialog.constants';

@Component({
  selector: 'app-telegram-bot-results',
  templateUrl: './telegram-bot-results.component.html',
  styleUrls: ['./telegram-bot-results.component.scss']
})
export class TelegramBotResultsComponent implements OnInit, AfterViewInit, OnDestroy {

  private subManager: Subscription;
  @Select(TelegramBotResultsState.telegramBotResults)
  telegramBotResults$: Observable<TelegramBotResult[]>;
  @Select(TelegramBotResultsState.notifyChangeTelegramBotResults)
  notifyChangeTelegramBotResults$: Observable<boolean>;

  private loggedUser: User;

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
    this.loggedUser = this.store.selectSnapshot(AuthState.loggedUser);

    this.displayedColumns  = [
      "createdAt",
      "token", 
      "chat_id", 
      "text", 
      "success", 
      "errorCode", 
      "errorMessage", 
      "actions",
    ];
    this.labelsColumns = {
      createdAt: this.translateService.getTranslate('label.telegram-bot.results.component.cols.date'),
      token: this.translateService.getTranslate('label.telegram-bot.results.component.cols.token'),
      chat_id: this.translateService.getTranslate('label.telegram-bot.results.component.cols.chat_id'),
      text: this.translateService.getTranslate('label.telegram-bot.results.component.cols.text'),
      success: this.translateService.getTranslate('label.telegram-bot.results.component.cols.success'),
      errorCode: this.translateService.getTranslate('label.telegram-bot.results.component.cols.errorCode'),
      errorMessage: this.translateService.getTranslate('label.telegram-bot.results.component.cols.errorMessage'),
    };
    this.dataSource = new MatTableDataSource<TelegramBotResult>();

    this.notifyChangeTelegramBotResults();
    this.fetchTelegramBotResults();
  }       

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = this.translateService.getTranslate('label.elements.per.page');
    this.paginator._intl.getRangeLabel = this.tableService.changePaginatorOfLabel();
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
    this.store.dispatch(new UnSubscribeTelegramBotResultsWS());
  }

  /* Store Functions */
  notifyChangeTelegramBotResults(){
    this.store.dispatch(new SubscribeTelegramBotResultsWS());
    this.subManager.add(
      this.notifyChangeTelegramBotResults$.subscribe({
        next: () => {
          this.store.dispatch(new FetchTelegramBotResults({ filter: { user: this.loggedUser.name } }))
        }
      })
    );
  }

  fetchTelegramBotResults() {
    this.spinnerService.showSpinner();
    this.subManager.add(
      this.telegramBotResults$.subscribe({
        next: () => {
          this.dataSource.data = [];
          const storeTelegramBotResults: TelegramBotResult[] = this.store.selectSnapshot(TelegramBotResultsState.telegramBotResults);

          if (storeTelegramBotResults && storeTelegramBotResults.length > 0) {
            this.dataSource.data = cloneDeep(storeTelegramBotResults);
          }

          this.spinnerService.hideSpinner(); 
        },
        error: () => {
          this.spinnerService.hideSpinner();
        },
      })
    );
  }

  deleteTelegramResult(data: TelegramBotResult) {
    this.spinnerService.showSpinner();
    this.store.dispatch(new DeleteTelegramBotResult({ _id: data._id })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(TelegramBotResultsState.success);
        if (!success) {
          this.toastService.addErrorMessage(this.store.selectSnapshot(TelegramBotResultsState.errorMsg));
          return;
        }
        
        this.toastService.addSuccessMessage(this.store.selectSnapshot(TelegramBotResultsState.successMsg));
      },
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(TelegramBotResultsState.errorMsg));
      }
    })
  }

  /* Table Functions */
  onDeleteElement(data: TelegramBotResult) {
    const dialogData: ConfirmDialogData = {
      title: this.translateService.getTranslate('label.telegram-bot.results.component.confirm-dialog.title'),
      text: this.translateService.getTranslate('label.telegram-bot.results.component.confirm-dialog.text'),
    }

    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: this.resolutionService.getMode() == this.resolutionService.resolutionConstants.MOBILE 
        ? ConfirmDialogConstants.MOBILE_WIDTH 
        : ConfirmDialogConstants.WEB_WIDTH,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.deleteTelegramResult(data);
    });
  }
}
