import { SpinnerConstants } from './shared/spinner/spinner.constants';
import { Component } from "@angular/core";
import { ConfigService } from "./shared/config/config.service";
import { WebSocketService } from "./websocket/websocket.service";
import { SpinnerService } from "./shared/spinner/spinner.service";
import { ConfigConstants } from './shared/config/config.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  public title: string;
  public readonly spinnerConstants = SpinnerConstants;
  public readonly configConstants = ConfigConstants;

  constructor(
    private readonly configService: ConfigService,
    private readonly websocketsService: WebSocketService,
    public readonly spinnerService: SpinnerService,
  ) {
    if (this.configService.getData(this.configConstants.TITLE)) {
      this.title = this.configService.getData(this.configConstants.TITLE) || 'sco-telegram-bot-tester';
    }

    this.websocketsService.connect();
  }
}
