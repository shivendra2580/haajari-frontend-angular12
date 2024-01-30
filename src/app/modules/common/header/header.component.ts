import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Key } from 'src/app/constant/key';
import { LoggedInUser } from 'src/app/models/logged-in-user';
import { DataService } from 'src/app/services/data.service';
import { HelperService } from 'src/app/services/helper.service';
import { RoleBasedAccessControlService } from 'src/app/services/role-based-access-control.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUser: LoggedInUser = new LoggedInUser();

  constructor(
    private router: Router, 
    private helperService: HelperService,
    private _data: DataService, 
    private rbacService: RoleBasedAccessControlService
  ) { }

  ngOnInit(): void {
    this.getLoggedInUserDetails();
  }

  getLoggedInUserDetails(){
    this.loggedInUser = this.helperService.getDecodedValueFromToken();
  }

  getFirstAndLastLetterFromName(name: string): string {
    let words = name.split(' ');
    if (words.length >= 2) {
      let firstLetter = words[0].charAt(0);
      let lastLetter = words[words.length - 1].charAt(0);
      return firstLetter + lastLetter;
    } else {
      return name.charAt(0);
    }
  }

  onLogout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  routeToAccountPage(tabName: string){
    this._data.activeTab = tabName !== 'account';
    this.router.navigate(["/setting/account-settings"], { queryParams: {tab: tabName } });
  }

  shouldDisplay(moduleName: string): boolean {
    const role = this.rbacService.getRole();
    const modulesToShowForManager = ['dashboard', 'team', 'project', 'reports', 'attendance'];
    return role === Key.ADMIN || (role === Key.MANAGER && modulesToShowForManager.includes(moduleName));
  }
}
