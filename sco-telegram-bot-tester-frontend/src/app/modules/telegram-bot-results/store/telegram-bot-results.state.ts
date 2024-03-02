import { HttpErrorsService } from '../../../shared/http-error/http-errors.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { catchError, map, tap } from "rxjs/operators";
import { TelegramBotResultsService } from '../telegram-bot-results.service';
import { DeleteTelegramBotResult, FetchTelegramBotResults, SubscribeTelegramBotResultsWS, UnSubscribeTelegramBotResultsWS } from './telegram-bot-results.actions';
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
  
  @Action(FetchTelegramBotResults)
  public fetchTelegramBotResults(
    { patchState }: StateContext<TelegramBotResultsStateModel>,
    { payload }: FetchTelegramBotResults
  ) { 
    return this.telegramBotResultsService.fetchTelegramBotResults(payload.filter).pipe(
      map((telegramBotResults: TelegramBotResult[]) => {
        patchState({
          telegramBotResults: [],
        });

        if (telegramBotResults) {
          patchState({
            telegramBotResults: telegramBotResults,
          });
        }
      })
    );
  }

  @Action(DeleteTelegramBotResult)
  public deleteTelegramBotResult(
    { patchState }: StateContext<TelegramBotResultsStateModel>,
    { payload }: DeleteTelegramBotResult
  ) {
    return this.telegramBotResultsService.deleteTelegramBotResult(payload._id).pipe(
      tap((result: boolean) => {
        patchState({
          success: false,
          errorMsg: this.translateService.getTranslate('label.telegram-bot-results.state.delete.error'),
        });

        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.telegram-bot-results.state.delete.success'),
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
        if (change) {
          let state = ctx.getState();

          state = {
            ...state,
            notifyChangeTelegramBotResults : !state.notifyChangeTelegramBotResults
          };

          ctx.setState({ ...state });
        }
      })
    )
  }

  @Action(UnSubscribeTelegramBotResultsWS)
  public unSubscribeTelegramBotResultsWS() {
    this.telegramBotResultsService.removeSocket();
  }
}