import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../common/header/header.component';
import { TopbarComponent } from '../common/topbar/topbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LiveManagerComponent } from './components/live-manager/live-manager.component';
import { LoginComponent } from './components/login/login.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { DynamicComponent } from './dynamic.component';
import { SlackAuthComponent } from './components/slack-auth/slack-auth.component';
import { AddToSlackComponent } from './components/add-to-slack/add-to-slack.component';
import { WaitingPageComponent } from './components/waiting-page/waiting-page.component';
import { TeamComponent } from './components/team/team.component';
import { TeamDetailComponent } from './components/team-detail/team-detail.component';
import { AuthGuard } from 'src/app/auth/auth-guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DatePipe } from '@angular/common';
import { EmployeeOnboardingComponent } from './components/employee-onboarding/employee-onboarding.component';
import { AttendanceSettingComponent } from './components/attendance-setting/attendance-setting.component';
import { CompanySettingComponent } from './components/company-setting/company-setting.component';
import { SelerySettingComponent } from './components/selery-setting/selery-setting.component';
import { RoleComponent } from './components/role/role.component';
import { EmployeeOnboardingFormComponent } from './components/employee-onboarding-form/employee-onboarding-form.component';
import { EmployeeOnboardingSidebarComponent } from '../common/employee-onboarding-sidebar/employee-onboarding-sidebar.component';
import { EmployeeAddressDetailComponent } from './components/employee-address-detail/employee-address-detail.component';
import { EmployeeDocumentComponent } from './components/employee-document/employee-document.component';
import { AcadmicComponent } from './components/acadmic/acadmic.component';
import { EmployeeExperienceComponent } from './components/employee-experience/employee-experience.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { EmergencyContactComponent } from './components/emergency-contact/emergency-contact.component';
import { ReportsComponent } from './components/reports/reports.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { LeaveSettingComponent } from './components/leave-setting/leave-setting.component';

const routes: Routes = [
  { path: '', component: DynamicComponent },
  { path: 'dashboard', component: DashboardComponent},  //canActivate: [AuthGuard] (To activate the auth guard, need to add this under curly braces of this line by seperated commas)
  { path: 'header', component: HeaderComponent },
  { path: 'topbar', component: TopbarComponent },
  { path: 'timetable', component: TimetableComponent},
  { path: 'project', component: ProjectComponent},
  { path: 'team', component: TeamComponent},
  { path: 'task-manager', component: TaskManagerComponent},
  { path: ' ', component: LiveManagerComponent},
  { path: 'onboarding', component: OnboardingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'userlist', component: UserlistComponent },
  {path: 'slackauth', component: SlackAuthComponent },
  {path: 'addtoslack', component: AddToSlackComponent},
  {path: 'waiting', component: WaitingPageComponent},
  {path: 'team-detail', component: TeamDetailComponent},
  {path: 'user-profile', component: UserProfileComponent}, 
  {path: 'employee-onboarding', component: EmployeeOnboardingComponent},
  {path: 'attendance-setting', component: AttendanceSettingComponent},
  {path: 'company-setting', component: CompanySettingComponent},
  {path: 'selery-setting', component: SelerySettingComponent},
  {path: 'role', component: RoleComponent},
  {path: 'employee-onboarding-form', component: EmployeeOnboardingFormComponent},
  {path: 'employee-onboarding-sidebar', component: EmployeeOnboardingSidebarComponent},
  {path: 'employee-address-detail', component: EmployeeAddressDetailComponent},
  {path: 'employee-document', component: EmployeeDocumentComponent},
  {path: 'acadmic', component: AcadmicComponent},
  {path: 'employee-experience', component: EmployeeExperienceComponent},
  {path: 'bank-details', component: BankDetailsComponent},
  {path: 'emergency-contact', component: EmergencyContactComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'employee-profile', component: EmployeeProfileComponent},
  {path: 'leave-setting', component: LeaveSettingComponent}

  

//   {path: 'team-detail', component: TeamDetailComponent},
//   {path: 'temporary', component: TemporaryComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class DynamicRoutingModule { }
