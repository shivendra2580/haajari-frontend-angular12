import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationOnboardingRoutingModule } from './organization-onboarding-routing.module';
import { OrganizationOnboardingComponent } from './organization-onboarding.component';
import { OrganizationPersonalInformationComponent } from './components/organization-personal-information/organization-personal-information.component';
import { AttendanceRuleSetupComponent } from './components/attendance-rule-setup/attendance-rule-setup.component';
import { LeaveRuleSetupComponent } from './components/leave-rule-setup/leave-rule-setup.component';
import { HolidayRuleSetupComponent } from './components/holiday-rule-setup/holiday-rule-setup.component';
import { OrganizationOnboardingSidebarComponent } from './components/organization-onboarding-sidebar/organization-onboarding-sidebar.component';
import { AutomationRulesComponent } from './components/automation-rules/automation-rules.component';
import { CreatRuleComponent } from './components/creat-rule/creat-rule.component';
import { LeaveSettingComponent } from './components/leave-setting/leave-setting.component';
import { LeaveSettingCreateComponent } from './components/leave-setting-create/leave-setting-create.component';
import { AddShiftTimeComponent } from './components/add-shift-time/add-shift-time.component';
import { BrowserModule} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrganizationOnboardingComponent,
    OrganizationPersonalInformationComponent,
    AttendanceRuleSetupComponent,
    LeaveRuleSetupComponent,
    HolidayRuleSetupComponent,
    OrganizationOnboardingSidebarComponent,
    AutomationRulesComponent,
    CreatRuleComponent,
    LeaveSettingComponent,
    LeaveSettingCreateComponent,
    AddShiftTimeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OrganizationOnboardingRoutingModule
  ]
})
export class OrganizationOnboardingModule { }
