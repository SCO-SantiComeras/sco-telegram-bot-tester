import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelegramBotTesterComponent } from './modules/telegram-bot-tester/component/telegram-bot-tester.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { RegisterComponent } from './modules/auth/components/register/register.component';
import { RequestPasswordComponent } from './modules/auth/components/request-password/request-password.component';
import { ResetPasswordComponent } from './modules/auth/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './modules/auth/components/confirm-email/confirm-email.component';
import { TelegramBotResultsComponent } from './modules/telegram-bot-results/component/telegram-bot-results.component';
import { AuthGuard } from './guards/auth.guard.service';
import { RoleGuard } from './guards/role.guard.service';
import { ManageUsersComponent } from './modules/users/components/manage-users/manage-users.component';

const routes: Routes = [
  {
    path: '',
    component: TelegramBotTesterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'request-password',
    component: RequestPasswordComponent,
  },
  {
    path: 'reset-password/:pwdRecoveryToken',
    component: ResetPasswordComponent,
  },
  {
    path: 'confirm-email/:email',
    component: ConfirmEmailComponent,
  },
  {
    path: 'results',
    component: TelegramBotResultsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
