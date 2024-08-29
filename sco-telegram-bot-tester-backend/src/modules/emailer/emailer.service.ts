import { TranslateService } from './../shared/translate/translate.service';
import { Inject, Injectable } from '@nestjs/common';
import { EmailerConfig } from './config/emailer-config';
import { Message } from './class/message';
import { UserDto } from '../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { translateConstants } from '../shared/translate/translate.constants';

@Injectable()
export class EmailerService {

  private readonly nodemailer = require('nodemailer');

  private frontend_port: number = undefined;
  private frontend_host: string = undefined;

  constructor(
    @Inject('CONFIG_OPTIONS') private options: EmailerConfig,
    private readonly configService: ConfigService,
    private readonly translateService: TranslateService,
  ) {
    this.frontend_port = this.configService.get('app.frontendPort') || 4200;
    this.frontend_host = this.configService.get('app.frontendHost') || 'localhost';
  }

  // Send Message Email Templates
  async sendReoveryPasswordEmail(user: UserDto, lang: string = translateConstants.DEFAULT_LANGUAGE): Promise<boolean> {
    const tokenExpirationTime: string = this.configService.get('frontend.tokenTimeExpiration') || '30';

    const text = `
      ${this.translateService.getTranslate('label.hello', lang)} ${user.name},<br> 
      ${this.translateService.getTranslate('label.email.recovery.password.1', lang)} '${user.pwdRecoveryToken}'.<br>
      ${this.translateService.getTranslate('label.email.recovery.password.2', lang)} ${tokenExpirationTime} ${this.translateService.getTranslate('label.minutes', lang)} 
      (${moment(user.pwdRecoveryDate).add({minutes: Number.parseInt(tokenExpirationTime)}).format('DD/MM/yyyy HH:mm:ss')}).<br>
      ${this.translateService.getTranslate('label.email.recovery.password.3', lang)} 
      <a href='http://${this.frontend_host}:${this.frontend_port}/reset-password/${user.pwdRecoveryToken}'>${this.translateService.getTranslate('label.email.recovery.password.4', lang)}</a>
    `;

    const message: Message = {
      text: `${text}`,
      receivers: [user.email],
      subject: `${this.configService.get('emailer.subjectTitle')} - ${this.translateService.getTranslate('label.email.recovery.password.subject', lang)}`,
      attachments: [],
    };

    return await this.sendMail(message);
  }

  async sendActiveUserEmail(user: UserDto, lang: string = translateConstants.DEFAULT_LANGUAGE): Promise<boolean> {
    const text = `
      ${this.translateService.getTranslate('label.hello', lang)} ${user.name},<br>
      ${this.translateService.getTranslate('label.email.active.user.1', lang)}.<br>
      ${this.translateService.getTranslate('label.email.active.user.2', lang)} 
      <a href='http://${this.frontend_host}:${this.frontend_port}/confirm-email/${user.email}'>${this.translateService.getTranslate('label.email.active.user.3', lang)}</a>
    `;

    const message: Message = {
      text: `${text}`,
      receivers: [user.email],
      subject: `${this.configService.get('emailer.subjectTitle')} - ${this.translateService.getTranslate('label.email.active.user.subject', lang)}`,
      attachments: [],
    };

    return await this.sendMail(message);
  }

  // Send Message Email
  private async sendMail(data: Message): Promise<boolean> {
    try {
      const transporter = this.nodemailer.createTransport({
        service: this.options.service ? this.options.service : 'gmail',
        auth: {
          user: this.options.sending_Email_Address,
          pass: this.options.sending_Email_Password,
        },
        tls: {
          rejectUnauthorized: false
        },
        secure: false,
      });

      const mailOptions = {
        from: this.options.sending_Email_Address,
        to: data.receivers,
        subject: data.subject,
        html: '<p>' + data.text + '</p>',
        attachments: data.attachments && data.attachments.length > 0 ? data.attachments : [],
      };

      let sendMailResult = false;
      await transporter.sendMail(mailOptions)
        .then(() => {
          console.log(`[sendMail] Email sent successfully`);
          sendMailResult = true;
        }).catch((error) => {
          sendMailResult = false;
          console.error(`[sendMail] SendMail Error: ${JSON.stringify(error)}`);
        });

      return sendMailResult;
    } catch(err) {
      console.error(`[sendMail] Error: ${JSON.stringify(err)}`);
      return false;
    }
  }
}
