import { HttpErrorsService } from '../../../shared/http-error/http-errors.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { catchError, map, tap } from "rxjs/operators";
import { TelegramBotResultsService } from '../telegram-bot-results.service';
import { AddTelegramBotResult, DeleteTelegramBotResult, FetchTelegramBotResults, SendMessageGroup, SubscribeTelegramBotResultsWS, UnSubscribeTelegramBotResultsWS } from './telegram-bot-results.actions';
import { TelegramBotResult } from '../model/telegram-bot-result';

export class TelegramBotResultsStateModel {
  telegramBotResults: TelegramBotResult[];
  telegramBotResult: TelegramBotResult;
  success: boolean;
  notifyChangeTelegramBotResults: boolean;
  errorMsg: string;
  successMsg: string;
}

export const telegramBotResultsStateDefaults: TelegramBotResultsStateModel = {
  telegramBotResults: [],
  telegramBotResult: undefined,
  success: false,
  notifyChangeTelegramBotResults: false,
  errorMsg: '',
  successMsg: '',
};

@State<TelegramBotResultsStateModel>({
  name: 'telegrambotresults',
  defaults: telegramBotResultsStateDefaults,
})

@Injectable()
export class TelegramBotResultsState {

  constructor(
    private readonly telegramBotResultsService: TelegramBotResultsService,
    private readonly translateService: TranslateService,
    private readonly httpErrorsService: HttpErrorsService,
  ) {}

  @Selector()
  static telegramBotResults(state: TelegramBotResultsStateModel): TelegramBotResult[] {
    return state.telegramBotResults;
  }

  @Selector()
  static telegramBotResult(state: TelegramBotResultsStateModel): TelegramBotResult {
    return state.telegramBotResult;
  }

  @Selector()
  static success(state: TelegramBotResultsStateModel): boolean {
    return state.success;
  }

  @Selector()
  static notifyChangeTelegramBotResults(state: TelegramBotResultsStateModel): boolean {
    return state.notifyChangeTelegramBotResults;
  }

  @Selector()
  static errorMsg(state: TelegramBotResultsStateModel): string {
    return state.errorMsg;
  }

  @Selector()
  static successMsg(state: TelegramBotResultsStateModel): string {
    return state.successMsg;
  }

  @Action(SendMessageGroup)
  public sendMessageGroup(
    { patchState }: StateContext<TelegramBotResultsStateModel>,
    { payload }: SendMessageGroup
  ) {
    return this.telegramBotResultsService.sendMessageGroup(payload.sendMessage).pipe(
      tap((result: boolean) => {
        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.telegram-bot-results.state.sendMessage.success'),
          });
        } else {
          patchState({
            success: false,
            errorMsg: this.translateService.getTranslate('label.telegram-bot-results.state.sendMessage.error'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.telegram-bot-results.state.sendMessage.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });
        
        throw new Error(error);
      }),
    );
  }
  
  @Action(FetchTelegramBotResults)
  public fetchTelegramBotResults(
    { patchState }: StateContext<TelegramBotResultsStateModel>,
    { payload }: FetchTelegramBotResults
  ) { 
    return this.telegramBotResultsService.fetchTelegramBotResults(payload.filter).pipe(
      map((telegramBotResults: TelegramBotResult[]) => {
        if (telegramBotResults) {
          patchState({
            telegramBotResults: telegramBotResults,
          });
        } else {
          patchState({
            telegramBotResults: [],
          });
        }
      })
    );
  }

  @Action(AddTelegramBotResult)
  public addTelegramBotResult(
    { patchState }: StateContext<TelegramBotResultsStateModel>,
    { payload }: AddTelegramBotResult
  ) {
    return this.telegramBotResultsService.addTelegramBotResult(payload.telegramBotResult).pipe(
      tap((telegramBotResult: TelegramBotResult) => {
        if (telegramBotResult) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.telegram-bot-results.state.create.success'),
            telegramBotResult: telegramBotResult,
          });
        } else {
          patchState({
            success: false,
            errorMsg: this.translateService.getTranslate('label.telegram-bot-results.state.create.error'),
            telegramBotResult: undefined,
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.telegram-bot-results.state.create.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
          telegramBotResult: undefined,
        });
        
        throw new Error(error);
      }),
    );
  }

  @Action(DeleteTelegramBotResult)
  public deleteTelegramBotResult(
    { patchState }: StateContext<TelegramBotResultsStateModel>,
    { payload }: DeleteTelegramBotResult
  ) {
    return this.telegramBotResultsService.deleteTelegramBotResult(payload._id).pipe(
      tap((result: boolean) => {
        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.telegram-bot-results.state.delete.success'),
          });
        } else {
          patchState({
            success: false,
            errorMsg: this.translateService.getTranslate('label.telegram-bot-results.state.delete.error'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.telegram-bot-results.state.delete.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });
        
        throw new Error(error);
      }),
    );
  }
  
  @Action(SubscribeTelegramBotResultsWS)
  public subscribeTelegramBotResultsWS(ctx: StateContext<TelegramBotResultsStateModel>) {
    return this.telegramBotResultsService.getTelegramBotResultsBySocket().pipe(
      map((change: boolean) => {
        if(change){
        let state = ctx.getState();
        state = {
          ...state,
          notifyChangeTelegramBotResults : !state.notifyChangeTelegramBotResults
        };
        ctx.setState({
          ...state,
        });
      }
      })
    )
  }

  @Action(UnSubscribeTelegramBotResultsWS)
  public unSubscribeTelegramBotResultsWS(ctx: StateContext<TelegramBotResultsStateModel>) {
    this.telegramBotResultsService.removeSocket();
  }
}