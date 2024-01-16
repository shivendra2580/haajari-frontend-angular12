import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Key } from 'src/app/constant/key';
import { ModuleRequest } from 'src/app/models/module-request';
import { ModuleResponse } from 'src/app/models/module-response';
import { RoleRequest } from 'src/app/models/role-request';
import { RoleAccessibilityType } from 'src/app/role-accessibility-type';
import { DataService } from 'src/app/services/data.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
})
export class RoleAddComponent implements OnInit {

  constructor(private dataService : DataService, private helperService : HelperService, private router : Router) { }

  ngOnInit(): void {
    this.setDataToBeUpdated();
    this.getSubModuleByRoleMethodCall();
    this.getAllRoleAccessibilityTypeMethodCall();
  }


  moduleResponse : ModuleResponse[] = [];
  moduleRequestList : ModuleRequest[] = [];
  roleRequest : RoleRequest = new RoleRequest();
  buttonLoader : boolean = false;
  @ViewChild("homeTab") homeTab !: ElementRef;


  getSubModuleByRoleMethodCall(){

    console.log(this.roleRequest.id);
    this.dataService.getSubModuleByRole(this.roleRequest.id).subscribe((data) => {

      this.moduleResponse = data;

      for(let i of this.moduleResponse){
        
        const submodules = i.subModules;

        for(let j of submodules){
          const moduleRequest : ModuleRequest = new ModuleRequest();
          moduleRequest.subModuleId = j.id;
          moduleRequest.privilegeId = j.privilegeId;
          this.moduleRequestList.push(moduleRequest);
        }
      }
      console.log(this.moduleResponse);
    }, (error) => {

      console.log(error);
    })
  }


  updateRoleWithPermissionsMethodCall(){
    this.buttonLoader = true;
    console.log(this.moduleRequestList);

    const uniqueModuleRequestList = [];

    for (let i of this.moduleRequestList) {
      if (i.privilegeId !== null && i.privilegeId !== 0) {
        const existingIndex = uniqueModuleRequestList.findIndex(
          (item) => item.subModuleId === i.subModuleId && item.privilegeId === i.privilegeId
        );
    
        if (existingIndex === -1) {
          uniqueModuleRequestList.push(i);
        }
      }
    }
    
    console.log(uniqueModuleRequestList);
    this.roleRequest.moduleRequestList = uniqueModuleRequestList;
 

    this.dataService.updateRoleWithPermissions(this.roleRequest).subscribe((data) => {
      console.log(data);
      debugger
      this.buttonLoader = false;
      this.router.navigate(['/role']);
      this.helperService.showToast("Role details have been successfully saved.", Key.TOAST_STATUS_SUCCESS);
    }, (error) => {
      console.log(error);
      debugger
      this.buttonLoader = false;
      this.helperService.showToast("Error caused while saving the role!", Key.TOAST_STATUS_ERROR);

    })
  }


  handleRadioClickForSubModule(privilegeId: number, subModule: any) {
    if (subModule.privilegeId === privilegeId) {
        subModule.privilegeId = null;
    } else {
        subModule.privilegeId = privilegeId;
    }

    this.settingSubModuleRequestValue(privilegeId, subModule);
  }


  settingSubModuleRequestValue(privilegeId : number, subModule : any){

    const moduleRequest : ModuleRequest = new ModuleRequest();
    moduleRequest.subModuleId = subModule.id;
    moduleRequest.privilegeId = privilegeId;

    const existingIndex = this.moduleRequestList.findIndex((item) => item.subModuleId === moduleRequest.subModuleId && item.privilegeId === moduleRequest.privilegeId);
    
    if (existingIndex !== -1) {
      this.moduleRequestList.splice(existingIndex, 1);
  } else {
      const subModuleIndex = this.moduleRequestList.findIndex((item) => item.subModuleId === moduleRequest.subModuleId);

      if (subModuleIndex !== -1) {
          this.moduleRequestList[subModuleIndex].privilegeId = privilegeId;
      } else {
          this.moduleRequestList.push(moduleRequest);
      }
  }

    console.log(this.moduleRequestList);
    this.roleRequest.moduleRequestList = this.moduleRequestList;

  }



  roleAccessibilityTypeList : RoleAccessibilityType[] = [];
  getAllRoleAccessibilityTypeMethodCall(){
    this.dataService.getAllRoleAccessibilityType().subscribe((response) => {
      this.roleAccessibilityTypeList = response;
    }, (error) => {
      console.log(error);
    })
  }

  settingRoleAccessibilityType(id : number){
    this.roleRequest.roleAccessibilityTypeId = id;
  }

  getDataToBeUpdated(){
    this.helperService.getData();
  }

  setDataToBeUpdated(){

    const role = this.helperService.getData();

    if(role === null || role === undefined){
      this.roleRequest.id = 0;
    } else {
      this.roleRequest.id = role.id;
      this.roleRequest.name = role.name;
      this.roleRequest.description = role.description;
      this.roleRequest.roleAccessibilityTypeId = role.roleAccessibilityType.id;
      
    }
  }


}
