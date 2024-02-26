import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelegramBotTesterComponent } from './modules/telegram-bot-tester/component/telegram-bot-tester.component';

const routes: Routes = [
  {
    path: '',
    component: TelegramBotTesterComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
