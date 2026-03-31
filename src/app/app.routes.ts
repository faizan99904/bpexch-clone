import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Layout/layout/layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { LoginPageComponent } from './Pages/login-page/login-page.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { AccountsComponent } from './Pages/accounts/accounts.component';
import { CreateNewUserComponent } from './Pages/create-new-user/create-new-user.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from "./Services/auth.guard";
import { DeletedUsersComponent } from "./Pages/deleted-users/deleted-users.component";
import { RoundsComponent } from "./Pages/rounds/rounds.component";
import { TransactionDetailsComponent } from './Pages/transaction-details/transaction-details.component';
import { BanksComponent } from "./Pages/banks/banks.component";
import { RequestDwComponent } from "./Pages/request-dw/request-dw.component";
import { BetsComponent } from "./Pages/bets/bets.component";
import { BetHistoryComponent } from './Pages/my-account/bet-history/bet-history.component';
import { AccountStatementComponent } from "./Pages/my-account/account-statement/account-statement.component";
import { MyProfileComponent } from "./Pages/my-account/my-profile/my-profile.component";
import { ReportsComponent } from './Pages/reports/reports.component';
import { MyAccountLayoutComponent } from "./Pages/my-account/my-account-layout/my-account-layout.component";
import { RoundBetsComponent } from "./Pages/round-bets/round-bets.component";
import { MultiplayerComponent } from "./Pages/multiplayer/multiplayer.component";
import { EventComponent } from './Pages/event/event.component';
import { CustomerSupportComponent } from './Pages/customer-support/customer-support.component';
import { ProfitLossComponent } from './Pages/profit-loss/profit-loss.component';
import { RoundRangeComponent } from './Pages/round-range/round-range.component';
import { reportHistory } from './Pages/report-history/report-history.component';
import { BannerComponent } from './Pages/banner/banner.component';
import { ActivityLogComponent } from './Pages/activity-log/activity-log.component';
import { UserPlReportComponent } from './Pages/user-pl-report/user-pl-report.component';
import { UserReportHistoryComponent } from './Pages/user-report-history/user-report-history.component';
import { UserRoundRangeComponent } from './Pages/user-round-range/user-round-range.component';


export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'users', component: AccountsComponent, canActivate: [AuthGuard] },
      { path: 'Common/Profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'new-user', component: CreateNewUserComponent, canActivate: [AuthGuard] },
      { path: 'new-user/:id', component: CreateNewUserComponent, canActivate: [AuthGuard] },
      { path: 'deleted-users', component: DeletedUsersComponent, canActivate: [AuthGuard] },
      { path: 'rounds', component: RoundsComponent, canActivate: [AuthGuard] },
      { path: 'banks', component: BanksComponent, canActivate: [AuthGuard] },
      { path: 'transaction-details', component: TransactionDetailsComponent, canActivate: [AuthGuard] },
      { path: 'transaction-details/:userId', component: TransactionDetailsComponent, canActivate: [AuthGuard] },
      { path: 'deposit-withdraw', component: RequestDwComponent, canActivate: [AuthGuard] },
      { path: 'deposit-withdraw/:userId', component: RequestDwComponent, canActivate: [AuthGuard] },
      { path: 'bets', component: BetsComponent, canActivate: [AuthGuard] },
      { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
      { path: 'round-bets/:roundId', component: RoundBetsComponent, canActivate: [AuthGuard] },
      { path: 'multiplayer', component: MultiplayerComponent, canActivate: [AuthGuard] },
      { path: 'event', component: EventComponent, canActivate: [AuthGuard] },
      { path: 'customer-support', component: CustomerSupportComponent, canActivate: [AuthGuard] },
      { path: 'profit-loss', component: ProfitLossComponent, canActivate: [AuthGuard] },
      { path: 'banner', component: BannerComponent, canActivate: [AuthGuard] },
      { path: 'activity-log', component: ActivityLogComponent, canActivate: [AuthGuard] },
      { path: 'round-range/:eventId/:startDate/:endDate', component: RoundRangeComponent, canActivate: [AuthGuard] },
      {
        path: 'user-bet-history/:eventId/:roundId',
        component: reportHistory,
      },
      {
        path: 'my-account',
        component: MyAccountLayoutComponent,
        children: [
          {
            path: 'bet-history/:userId/:role',
            component: BetHistoryComponent,
          },
          {
            path: 'account-statement/:userId/:role',
            component: AccountStatementComponent,
          },

          {
            path: 'profile/:userId/:role',
            component: MyProfileComponent,
          },

          {
            path: 'user-pl-report/:userId/:role',
            component: UserPlReportComponent,
          },

          {
            path: 'user-round/:userId/:role/:to/:from/:eventId',
            component: UserRoundRangeComponent,
          },
          {
            path: 'user-report-history/:userId/:role/:eventId/:roundId',
            component: UserReportHistoryComponent,
          },
        ]
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
