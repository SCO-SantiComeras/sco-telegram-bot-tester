import { HttpErrorsService } from '../../../shared/http-error/http-errors.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { catchError, map, tap } from "rxjs/operators";
import { TelegramBotTesterService } from '../telegram-bot-tester.service';
import { SendMessageGroup, SubscribeSendMessageGroupWS, UnSubscribeSendMessageGroupWS } from './telegram-bot-tester.actions';

export class TelegramBotTesterStateModel {
  success: boolean;
  notifyChangeSendMessageGroups: boolean;
  errorMsg: string;
  successMsg: string;
}

export const telegramBotTesterStateDefaults: TelegramBotTesterStateModel = {
  success: false,
  notifyChangeSendMessageGroups: false,
  errorMsg: '',
  successMsg: '',
};

@State<TelegramBotTesterStateModel>({
  name: 'telegrambottester',
  defaults: telegramBotTesterStateDefaults,
})

@Injectable()
export class TelegramBotTesterState {

  constructor(
    private readonly telegramBotTesterService: TelegramBotTesterService,
    private readonly translateService: TranslateService,
    private readonly httpErrorsService: HttpErrorsService,
  ) {}

  @Selector()
  static success(state: TelegramBotTesterStateModel): boolean {
    return state.success;
  }

  @Selector()
  static notifyChangeSendMessageGroups(state: TelegramBotTesterStateModel): boolean {
    return state.notifyChangeSendMessageGroups;
  }

  @Selector()
  static errorMsg(state: TelegramBotTesterStateModel): string {
    return state.errorMsg;
  }

  @Selector()
  static successMsg(state: TelegramBotTesterStateModel): string {
    return state.successMsg;
  }

  @Action(SendMessageGroup)
  public sendMessageGroup(
    { patchState }: StateContext<TelegramBotTesterStateModel>,
    { payload }: SendMessageGroup
  ) {
    return this.telegramBotTesterService.sendMessageGroup(payload.sendMessage).pipe(
      tap((result: boolean) => {
        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.telegram-bot-tester.store.sendMessage.success'),
          });
        } else {
          patchState({
            success: false,
            errorMsg: this.translateService.getTranslate('label.telegram-bot-tester.store.sendMessage.error'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.telegram-bot-tester.store.sendMessage.error');
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
  
  @Action(SubscribeSendMessageGroupWS)
  public subscribeSendMessageGroupWS(ctx: StateContext<TelegramBotTesterStateModel>) {
    return this.telegramBotTesterService.getSendMessageGroupBySocket().pipe(
      map((change: boolean) => {
        if(change){
        let state = ctx.getState();
        state = {
          ...state,
          notifyChangeSendMessageGroups : !state.notifyChangeSendMessageGroups
        };
        ctx.setState({
          ...state,
        });
      }
      })
    )
  }

  @Action(UnSubscribeSendMessageGroupWS)
  public unSubscribeSendMessageGroupWS(ctx: StateContext<TelegramBotTesterStateModel>) {
    this.telegramBotTesterService.removeSocket();
  }
}