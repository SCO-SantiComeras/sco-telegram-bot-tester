import { HttpErrorsService } from 'src/app/shared/http-error/http-errors.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TelegramBotTesterService } from "../telegram-bot-tester.service";
import { SendMessageGroup } from './telegram-bot-tester.actions';
import { catchError, tap } from 'rxjs';

export class TelegramBotTesterStateModel {
  success: boolean;
  errorMsg: string;
  successMsg: string;
}

export const telegramBotTesterStateDefaults: TelegramBotTesterStateModel = {
  success: false,
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
        patchState({
          success: false,
          errorMsg: this.translateService.getTranslate('label.telegram-bot-tester.state.sendMessage.error'),
        });

        if (result) {
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.telegram-bot-tester.state.sendMessage.success'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.telegram-bot-tester.state.sendMessage.error');
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
}