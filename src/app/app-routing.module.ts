import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './modules/common/error-page/error-page.component';

const routes: Routes = [

  // { path: '', redirectTo: '/login', pathMatch:'full'},
  { path: '', loadChildren: () => import('./modules/dynamic/dynamic.module').then(m => m.DynamicModule) },
  { path: 'employee-onboarding', loadChildren: () => import('./modules/employee-onboarding/employee-onboarding.module').then(m => m.EmployeeOnboardingModule) },
  { path: '**', component : ErrorPageComponent},
  

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation : 'reload'})],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
