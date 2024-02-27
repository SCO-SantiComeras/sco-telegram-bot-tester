import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { FormsService } from '../../../shared/forms/forms.service';
import { TranslateService } from '../../../shared/translate/translate.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsError } from 'src/app/shared/forms/forms-errors.model';
import { ResolutionService } from 'src/app/shared/resolution/resolution.service';
import { SendMessage } from '../model/send-message';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { Store } from '@ngxs/store';
import { TelegramBotTesterMockConstants } from 'src/app/shared/constants/telegram-bot-tester.mock.constants';
import { environment } from 'src/environments/environment';
import { CacheConstants } from 'src/app/shared/cache/cache.constants';
import { ConfigConstants } from 'src/app/shared/config/config.constants';
import { ConfigService } from 'src/app/shared/config/config.service';
import { SendMessageGroup } from '../../telegram-bot-results/store/telegram-bot-results.actions';
import { TelegramBotResultsState } from '../../telegram-bot-results/store/telegram-bot-results.state';

@Component({
  selector: 'app-telegram-bot-tester',
  templateUrl: './telegram-bot-tester.component.html',
  styleUrls: ['./telegram-bot-tester.component.scss']
})
export class TelegramBotTesterComponent implements OnInit, OnDestroy {

  public cacheConstants = CacheConstants;
  public configConstants = ConfigConstants;

  public sendMessageForm: FormGroup;
  public formErrors: FormsError[];

  constructor(
    public readonly resolutionService: ResolutionService,
    private readonly translateService: TranslateService,
    public readonly formsService: FormsService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly store: Store,
    private readonly configService: ConfigService,
  ) {}

  ngOnInit() {
    this.sendMessageForm = new FormGroup({
      token: new FormControl('', [Validators.required]),
      chat_id: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
    });

    if (!environment.production) {
      this.setMockedValues();
    }
  }

  ngOnDestroy(): void {
    this.sendMessageForm.reset();
  }

  onCLickClean() {
    this.sendMessageForm = this.formsService.cleanErrors(this.sendMessageForm);
  }

  onClickSubmit() {
    const sendMessage: SendMessage = this.sendMessageForm.value;
    if (!this.validateFormValues(sendMessage)) {
      return;
    }

    if (sendMessage.chat_id[0] != '-') {
      sendMessage.chat_id = `-${sendMessage.chat_id}`;
    }

    this.spinnerService.showSpinner();
    this.store.dispatch(new SendMessageGroup({ sendMessage: sendMessage })).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();

        const success: boolean = this.store.selectSnapshot(TelegramBotResultsState.success);
        if (success) {
          if (this.configService.getData(this.configConstants.RESET_FORM_AFTER_SUCCESS_REQUEST)) {
            this.onCLickClean();
          }
          this.toastService.addSuccessMessage(this.store.selectSnapshot(TelegramBotResultsState.successMsg));
          return;
        }

        this.toastService.addErrorMessage(this.store.selectSnapshot(TelegramBotResultsState.errorMsg));
      }, 
      error: () => {
        this.spinnerService.hideSpinner();
        this.toastService.addErrorMessage(this.store.selectSnapshot(TelegramBotResultsState.errorMsg));
      }
    })
  }

  private validateFormValues(sendMessage: SendMessage): boolean {
    this.formErrors = [];

    if (!sendMessage.token) {
      this.formErrors.push({ formControlName: 'token', error: this.translateService.getTranslate('label.telegram-bot.component.form.validate.token') });
    }

    if (sendMessage.token) {
      const splitToken: string[] = sendMessage.token.split(':');
      if (!splitToken  || splitToken && splitToken.length != 2) {
        this.formErrors.push({ formControlName: 'token', error: this.translateService.getTranslate('label.telegram-bot.component.form.validate.token.format') });
      }
    }

    if (!sendMessage.chat_id) {
      this.formErrors.push({ formControlName: 'chat_id', error: this.translateService.getTranslate('label.telegram-bot.component.form.validate.chat_id') });
    }

    if (!sendMessage.text) {
      this.formErrors.push({ formControlName: 'text', error: this.translateService.getTranslate('label.telegram-bot.component.form.validate.text') });
    }

    this.sendMessageForm = this.formsService.setErrors(this.sendMessageForm, this.formErrors);

    if (this.formErrors && this.formErrors.length > 0) {
      return false;
    }

    return true;
  }

  private setMockedValues() {
    this.sendMessageForm.controls.token.setValue(TelegramBotTesterMockConstants.TOKEN);
    this.sendMessageForm.controls.chat_id.setValue(TelegramBotTesterMockConstants.CHAT_ID);
    this.sendMessageForm.controls.text.setValue(TelegramBotTesterMockConstants.TEXT);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key != 'Enter') {
      return;
    }

    this.onClickSubmit();
  }
}
