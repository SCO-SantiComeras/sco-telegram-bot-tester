import { SpinnerConstants } from './shared/spinner/spinner.constants';
import { Component, HostListener } from "@angular/core";
import { ConfigService } from "./shared/config/config.service";
import { WebSocketService } from "./websocket/websocket.service";
import { SpinnerService } from "./shared/spinner/spinner.service";
import { ConfigConstants } from './shared/config/config.constants';
import { CacheService } from './shared/cache/cache.service';
import { CacheConstants } from './shared/cache/cache.constants';
import { TranslateService } from './shared/translate/translate.service';
import { ResolutionService } from './shared/resolution/resolution.service';
import { ResolutionConstants } from './shared/resolution/resolution.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  public title: string;
  public viewMode: string;

  public readonly spinnerConstants = SpinnerConstants;
  public readonly configConstants = ConfigConstants;
  public readonly cacheConstants = CacheConstants;
  public readonly resolutionConstants = ResolutionConstants;

  constructor(
    private readonly configService: ConfigService,
    private readonly websocketsService: WebSocketService,
    public readonly spinnerService: SpinnerService,
    public readonly cacheService: CacheService,
    private readonly translateService: TranslateService,
    public readonly resolutionService: ResolutionService,
    private readonly router: Router,
  ) {
    if (this.configService.getData(this.configConstants.TITLE)) {
      this.title = this.configService.getData(this.configConstants.TITLE) || 'sco-telegram-bot-tester';
    }

    this.viewMode = this.resolutionService.getMode();

    this.cacheService.setElement(this.cacheConstants.TITLE, this.translateService.getTranslate('label.header.cache.title'))
    this.websocketsService.connect();
  }

  onClickHomeLogo() {
    this.router.navigateByUrl('');
  }

  onClickSignUp() {
    this.router.navigateByUrl('signup');
  }

  onClickLogIn() {
    this.router.navigateByUrl('login');
  }

  onClickLogOut() {
    
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.viewMode = this.resolutionService.getMode($event.target.innerWidth);
  }
}
