import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { error } from 'console';
import { template } from 'lodash';
import { constant } from 'src/app/constant/constant';
import { Key } from 'src/app/constant/key';
import { FullLeaveSettingRequest } from 'src/app/models/Full-Leave-Setting-Request';
import { FullLeaveSettingResponse } from 'src/app/models/full-leave-setting-response';
import { LeaveSettingCategoryResponse } from 'src/app/models/leave-categories-response';
import { LeaveSettingResponse } from 'src/app/models/leave-setting-response';
import { Staff } from 'src/app/models/staff';
import { StaffSelectionUserList } from 'src/app/models/staff-selection-userlist';
import { DataService } from 'src/app/services/data.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-leave-setting',
  templateUrl: './leave-setting.component.html',
  styleUrls: ['./leave-setting.component.css']
})
export class LeaveSettingComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService, private helperService : HelperService) {
    this.form = this.fb.group({
      categories: this.fb.array([])
    });
    this.addRow();
  }

  // createLeaveCategory() {
  //   return this.fb.group({
  //     leaveName: ['', Validators.required],
  //     leaveCount: ['', Validators.required],
  //     leaveRules: [''],
  //     carryForwardDays: ['']
  //   });
  // }
  readonly constants = constant;

  ngOnInit(): void {
    this.getUserByFiltersMethodCall(0);
    this.getFullLeaveSettingInformation();
    // this.findUsersOfLeaveSetting(30);

    const leaveId = localStorage.getItem("tempId");

    if(leaveId!=null){
      this.idFlag=true;
      this.localStorageLeaveRuleId=+leaveId;
    }else{
      this.idFlag=false;
      this.localStorageLeaveRuleId=0;
    }
  }

  localStorageLeaveRuleId!:number;

  idFlag:boolean=false;

  leaveSettingPlaceholder: boolean = false;

  leaveSettingResponse: LeaveSettingResponse = new LeaveSettingResponse();

  

  isFormValid:boolean = false;
  checkFormValidity(form: NgForm | null) {
    debugger
    this.errorTemplateNameFlag = false;
    this.isFormValid = form?.valid ?? false; 
  }


  // registerLeaveSettingTemplate() {
  //   this.leaveCategoryTab.nativeElement.click();
  //   this.dataService
  //     .registerLeaveSettingTemplate(this.leaveSettingResponse)
  //     .subscribe(
  //       (response) => {
  //         this.leaveSettingResponse.id = response.id;
  //         localStorage.setItem("tempId", response.id.toString());
  //         console.log('Leave setting registered successfully:', response);
  //       },
  //       (error) => {
  //         console.error('Error registering leave setting:', error);
  //       }
  //     );
  // }

  setAccrualType(accrualType: string) {
    this.leaveSettingResponse.accrualType = accrualType;
  }

  enterCountFlag: boolean = false;
  setSandwichRules(rule: string) {
    this.leaveSettingResponse.sandwichRules = rule;
    if (rule === 'Count') {
      this.enterCountFlag = true;
    } else {
      this.enterCountFlag = false;
    }
  }


  // *********** second 
  //   leaveCategories = [{ leaveName: '', leaveCount: 0, leaveRules: 'Lapse', carryForwardDays: 0 , leaveSettingId: 0}];

  //   // ...

  // setLeaveRule(index: number, rule: string) {
  //   this.leaveSettingCategories[index].leaveRules = rule;
  //   if (rule === 'Lapse') {
  //     this.leaveSettingCategories[index].carryForwardDays = 0;
  //   }
  // }

  // addLeave() {
  //   this.leaveCategories.push({
  //     leaveName: '',
  //     leaveCount: 0,
  //     leaveRules: 'Lapse',
  //     carryForwardDays: 0,
  //     leaveSettingId: 0
  //   });
  // }

  // removeLeave(index: number) {
  //   this.leaveSettingCategories.splice(index, 1);
  // }

  // // ...

  get categories(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  addRow() {
    const newRow = this.fb.group({
      leaveName: ['', Validators.required],
      leaveCount: ['', [Validators.required, Validators.min(0)]],
      leaveRules: [''],
      carryForwardDays: [''],
    });

    this.categories.push(newRow);
  }

  // leaveSettingCategories: LeaveSettingCategoryResponse[] = [];
  // templateId!: number;

  deleteRow(index: number) {
    const categoriesArray = this.form.get('categories') as FormArray;
    categoriesArray.removeAt(index);
    this.helperService.showToast("Leave type deleted successfully", Key.TOAST_STATUS_SUCCESS);
  }

  hasError(controlName: string, index: number, errorName: string) {
    const control = this.categories.at(index)?.get(controlName);
    return control?.touched && control?.hasError(errorName);
  }
  


  // saveLeaveCategories() {
  //   const tempId = localStorage.getItem("tempId");
  //   let templateId: number | null = null;

  //   if (tempId !== null) {
  //     templateId = +tempId;
  //   }

  //   if (templateId === null || isNaN(templateId)) {
  //     console.error('Invalid templateId:', templateId);
  //     return;
  //   }

  //   debugger
  //   // const leaveSettingCategories: LeaveSettingCategoryResponse[] = this.form.value.categories;

  //   const leaveSettingCategories = this.form.value.categories.map((category: any) => ({
  //     ...category,
  //     leaveSettingId: templateId
  //   }));

  //   this.staffSelectionTab.nativeElement.click();

  //   this.dataService.registerLeaveCategories(leaveSettingCategories, templateId)
  //     .subscribe(response => {
  //       console.log('Leave categories saved successfully:', response);
  //     }, error => {
  //       console.error('Error saving leave categories:', error);
  //     });
  // }


  // *************

  

  // saveLeaveSetting() {
  //   debugger
  //   const tempId = localStorage.getItem("tempId");
  //   let templateId: number | null = null;

  //   if (tempId !== null) {
  //     templateId = +tempId;
  //   }

  //   if (templateId === null || isNaN(templateId)) {
  //     console.error('Invalid templateId:', templateId);
  //     return;
  //   }
  //   console.log(this.selectedStaffsUuids);
  //   // if (this.selectedStaffsUuids.length > 0 && templateId) {
  //     this.dataService.registerUserOfLeaveSetting(templateId, this.selectedStaffsUuids).subscribe(
  //       response => {
  //         this.getFullLeaveSettingInformation()
  //         this.requestLeaveCloseModel.nativeElement.click();
  //         localStorage.removeItem("tempId")
  //         this.emptyAddLeaveSettingRule();
  //         // location.reload();
  //         console.log('Users saved for leave setting:', response);
  //       },
  //       error => {
  //         console.error('Error saving users for leave setting:', error);
  //       }
  //     );
  //   // } else {
  //   //   // console.error(error);
  //   // }
  // }

  itemPerPage: number = 8;
  pageNumber: number = 1;
  total !: number;
  rowNumber: number = 1;
  searchText: string = '';
  staffs: Staff[] = [];

  searchUserPlaceholderFlag:boolean=false;
  crossFlag: boolean = false;
  
  searchUsers() {
    this.crossFlag=true;
    this.searchUserPlaceholderFlag = true;
    this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
    if(this.searchText== ''){
      this.crossFlag=false;
    }
  }

  clearSearchUsers(){
    this.searchUserPlaceholderFlag = false;
    this.searchText='';
    this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
    this.crossFlag=false;
  }

  selectedStaffsUuids: string[] = [];
  selectedStaffs: Staff[] = [];
  isAllSelected: boolean = false;

  isStaffEmpty:boolean=false;

  staffSelectionUserList: StaffSelectionUserList = new StaffSelectionUserList();

  getUserByFiltersMethodCall(leaveSettingId: number) {
    this.selectedStaffsUuids=[];
    this.dataService.getUsersByFilterForLeaveSetting(this.itemPerPage, this.pageNumber, 'asc', 'id', this.searchText, '', leaveSettingId).subscribe((response) => {
      // this.staffSelectionUserList.user = response.users;
      this.staffs = response.users.map((staff: StaffSelectionUserList) => ({
        ...staff.user,
        selected: this.selectedStaffsUuids.includes(staff.user.uuid),
        // isMapped:
        isAdded: staff.mapped
      }));
      this.total = response.count;

      if(this.total== 0){
        this.isStaffEmpty = true;
      }else{
        this.isStaffEmpty = false;
      }

      // if(this.total==0){
      //   this.searchUserPlaceholderFlag = true;
      // }

      this.isAllSelected = this.staffs.every(staff => staff.selected);
      
    }, (error) => {
      console.error(error);
    });
  }

  isUserInLeaveRule(userUuid: string): boolean {
    const userLeaveRule = this.fullLeaveSettingResponse.userLeaveRule;
    return userLeaveRule && userLeaveRule.length > 0 && userLeaveRule.some(rule => rule.userUuids.includes(userUuid));
  }

  checkIndividualSelection() {
    this.isAllUsersSelected = this.staffs.every(staff => staff.selected);
    this.isAllSelected = this.isAllUsersSelected;
    this.updateSelectedStaffs();
  }

  checkAndUpdateAllSelected() {
    this.isAllSelected = this.staffs.length > 0 && this.staffs.every(staff => staff.selected);
    this.isAllUsersSelected = this.selectedStaffsUuids.length === this.total;
  }

  updateSelectedStaffs() {
    this.staffs.forEach(staff => {
      if (staff.selected && !this.selectedStaffsUuids.includes(staff.uuid)) {
        this.selectedStaffsUuids.push(staff.uuid);
      } else if (!staff.selected && this.selectedStaffsUuids.includes(staff.uuid)) {
        this.selectedStaffsUuids = this.selectedStaffsUuids.filter(uuid => uuid !== staff.uuid);
      }
    });

    this.checkAndUpdateAllSelected();

    // this.activeModel2=true;

    // if(this.selectedStaffsUuids.length === 0){
    //   this.activeModel2 = false;
    // }
  }


  // #####################################################
  isAllUsersSelected: boolean = false;

  // Method to toggle all users' selection
  selectAllUsers(isChecked: boolean) {

    // const inputElement = event.target as HTMLInputElement;
    // const isChecked = inputElement ? inputElement.checked : false;
    this.isAllUsersSelected = isChecked;
    this.isAllSelected = isChecked; // Make sure this reflects the change on the current page
    this.staffs.forEach(staff => staff.selected = isChecked); // Update each staff's selected property

    if (isChecked) {
      // If selecting all, add all user UUIDs to the selectedStaffsUuids list
      // this.activeModel2 = true;
      this.getAllUsersUuids().then(allUuids => {
        this.selectedStaffsUuids = allUuids;
      });
    } else {
      this.selectedStaffsUuids = [];
      // this.activeModel2 = false;
    }

  }

  selectAll(checked: boolean) {
    this.isAllSelected = checked;
    this.staffs.forEach(staff => staff.selected = checked);

    // Update the selectedStaffsUuids based on the current page selection
    if (checked) {
      // this.activeModel2 = true;
      this.staffs.forEach(staff => {
        if (!this.selectedStaffsUuids.includes(staff.uuid)) {
          this.selectedStaffsUuids.push(staff.uuid);
        }
      });
    } else {
      this.staffs.forEach(staff => {
        if (this.selectedStaffsUuids.includes(staff.uuid)) {
          this.selectedStaffsUuids = this.selectedStaffsUuids.filter(uuid => uuid !== staff.uuid);
        }
      });
    }
  }



  // Asynchronous function to get all user UUIDs
  async getAllUsersUuids(): Promise<string[]> {
    debugger
    const response = await this.dataService.getUsersByFilterForLeaveSetting(this.total, 1, 'asc', 'id', this.searchText, '', this.idOfLeaveSetting).toPromise();
    // const response = await this.dataService.getAllUsers('asc', 'id', this.searchText, '').toPromise();
    // this.staffs = response.users.map((staff: StaffSelectionUserList) => ({
    //   ...staff.user,
    //   selected: this.selectedStaffsUuids.includes(staff.user.uuid),
    //   // isMapped:
    //   isAdded: staff.mapped
    // }));
    return response.users.map((userDto: any) => userDto.user.uuid);
    // return response.users.map((user: { uuid: any; }) => user.uuid);
  }

  // Call this method when the select all users checkbox value changes
  onSelectAllUsersChange(event: any) {
    this.selectAllUsers(event.target.checked);
  }

  unselectAllUsers() {
    this.isAllUsersSelected = false;
    this.isAllSelected = false;
    this.staffs.forEach(staff => staff.selected = false);
    this.selectedStaffsUuids = [];
    // this.activeModel2 = false;
  }



  // ##### Pagination ############
  changePage(page: number | string) {
    if (typeof page === 'number') {
      this.pageNumber = page;
    } else if (page === 'prev' && this.pageNumber > 1) {
      this.pageNumber--;
    } else if (page === 'next' && this.pageNumber < this.totalPages) {
      this.pageNumber++;
    }
    this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.total / this.itemPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemPerPage);
  }
  getStartIndex(): number {
    return (this.pageNumber - 1) * this.itemPerPage + 1;
  }
  getEndIndex(): number {
    const endIndex = this.pageNumber * this.itemPerPage;
    return endIndex > this.total ? this.total : endIndex;
  }

  onTableDataChange(event: any) {
    this.pageNumber = event;
  }

  // *************** new 

  fullLeaveSettingResponseList: FullLeaveSettingResponse[] = [];
  isLoading:boolean=false;
  isLeaveErrorPlaceholder:boolean=false;

  getFullLeaveSettingInformation(): void {
    this.isLoading=true;
    this.dataService.getFullLeaveSettingInformation()
      .subscribe(response => {
        this.fullLeaveSettingResponseList = response;
        this.isLoading=false;
        if(response==null || response.length==0){
          this.leaveSettingPlaceholder = true;
        }else{
          this.leaveSettingPlaceholder = false;
        }
        this.templateSettingTab.nativeElement.click();
      }, error => {
        this.isLeaveErrorPlaceholder=true;
        this.isLoading=false;
        // this.leaveSettingPlaceholder = true;
        console.error('Error fetching leave setting information:', error);
      });
  }
  setLeaveRule(index: number, value: string): void {
    const leaveRulesControl = (this.form.get('categories') as FormArray).at(index)?.get('leaveRules');
    if (leaveRulesControl) {
        leaveRulesControl.setValue(value);
    }
}
// leaveSettingForm!:NgForm;
  fullLeaveSettingResponse!: FullLeaveSettingResponse;
  

  getLeaveSettingInformationById(leaveSettingId: number): void {
    this.pageNumber = 1;
    this.pageNumberUser = 1;
    this.dataService.getLeaveSettingInformationById(leaveSettingId)
      .subscribe(response => {
        this.selectedStaffsUuids = [];
        this.selectedStaffsUuidsUser = [];
        this.errorTemplateNameFlag = false;
        this.fullLeaveSettingResponse = response;
        this.idOfLeaveSetting = leaveSettingId;
        this.leaveSettingResponse = this.fullLeaveSettingResponse.leaveSetting;
        // this.selectedStaffsUuidsUser =  this.fullLeaveSettingResponse.userUuids;
        // if(this.fullLeaveSettingResponse.userUuids.length===0){
        //   this.isMappedStaffEmpty=true;
        // }else{
        //   this.isMappedStaffEmpty=false;
        // }
        this.templateSettingTab.nativeElement.click();
        if(this.leaveSettingResponse!=null){
        this.isFormValid=true;
        }
        // this.checkFormValidity(this.leaveSettingForm);
        // this.form.reset();
        // Reset the form without emitting the events
       this.form.reset({ emitEvent: false });

        const categoriesArray = this.form.get('categories') as FormArray;

        // Clear the existing form controls
        categoriesArray.clear();

        this.fullLeaveSettingResponse.leaveSettingCategories.forEach(category => {
          const categoryGroup = this.fb.group({
            leaveName: category.leaveName,
            leaveCount: category.leaveCount,
            leaveRules: category.leaveRules,
            carryForwardDays: category.carryForwardDays
          });

  
          categoriesArray.push(categoryGroup);
        });

        this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
        this.findUsersOfLeaveSetting(leaveSettingId);

      }, error => {
        console.error('Error fetching leave setting information by ID:', error);
      });
  }
 @ViewChild("templateSettingTab") templateSettingTab!:ElementRef;
 @ViewChild("newStaffSelectionTab") newStaffSelectionTab!:ElementRef;
 openStaffSelection(){
  this.newStaffSelectionTab.nativeElement.click();
 }
//  @ViewChild("leaveSettingForm") leaveSettingForm!:ElementRef;
//  leaveSettingForm!: NgForm;
  emptyAddLeaveSettingRule(){
    debugger
    
    this.idOfLeaveSetting=0;
    this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
    this.staffsUser = [];
    this.totalUser = 0;
    this.isMappedStaffEmpty=true;
    // this.getUserByFiltersMethodCall();
    this.templateSettingTab.nativeElement.click();
    this.unselectAllUsers();
    this.selectedStaffsUuids = [];
    this.selectedStaffsUuidsUser = [];
    // this.selectedStaffsUuids.length = 0; 
    // this.leaveSettingForm.form.markAsPristine();
    this.leaveSettingResponse = new LeaveSettingResponse();
    this.leaveSettingResponse.templateName = '';
    this.form.reset();
    // Clear the existing form controls
    const categoriesArray = this.form.get('categories') as FormArray;
    categoriesArray.clear();
    this.addRow();
   
    }

  deleteLeaveSettingRule(leaveSettingId: number): void {
    this.dataService.deleteLeaveSettingRule(leaveSettingId).subscribe(
      () => {
        this.getFullLeaveSettingInformation();
        console.log('Leave setting rule deleted successfully.');
        this.helperService.showToast("Leave setting rule deleted successfully.", Key.TOAST_STATUS_SUCCESS);
      },
      (error) => {
        console.error('Error deleting leave setting rule:', error);
        this.helperService.showToast(error.message, Key.TOAST_STATUS_ERROR);
      }
    );
  }



  // ###################### saveInOne ###################

  fullLeaveSettingRuleRequest : FullLeaveSettingRequest = new FullLeaveSettingRequest();
  @ViewChild("requestLeaveCloseModel") requestLeaveCloseModel!:ElementRef;
  

  saveLeaveSettingRules(flag:boolean) {
    debugger
    this.fullLeaveSettingRuleRequest.leaveSettingResponse = this.leaveSettingResponse;
    if(constant.EMPTY_STRINGS.includes(this.leaveSettingResponse.templateName)){
      this.errorTemplateNameFlag=true;
      this.templateSettingTab.nativeElement.click();
      return;
    }else{
      this.errorTemplateNameFlag=false;
    }
    const leaveSettingCategories = this.form.value.categories.map((category: any) => ({
      ...category
    }));
    this.fullLeaveSettingRuleRequest.leaveSettingCategoryResponse = leaveSettingCategories;
    this.fullLeaveSettingRuleRequest.userUuids = [...this.selectedStaffsUuids, ...this.selectedStaffsUuidsUser];
    // selectedStaffsUuidsUser;

    if(flag){
    this.dataService
      .registerLeaveSettingRules(this.fullLeaveSettingRuleRequest)
      .subscribe(
        (response) => {
          console.log('Leave rules registered successfully:', response);
          this.getFullLeaveSettingInformation();
          this.requestLeaveCloseModel.nativeElement.click();
          this.helperService.showToast("Leave rules registered successfully", Key.TOAST_STATUS_SUCCESS);
        },
        (error) => {
          console.error('Error registering leave setting:', error);
          this.helperService.showToast(error.message, Key.TOAST_STATUS_ERROR);
        }
      );
    }else if(!flag){
      this.dataService
      .registerLeaveSettingRules(this.fullLeaveSettingRuleRequest)
      .subscribe(
        (response) => {
          this.idOfLeaveSetting = response.leaveSettingResponse.id;
          console.log('Leave rules registered successfully:', response);
          this.getUserByFiltersMethodCall(this.idOfLeaveSetting);

         this.isMappedStaffEmpty=false;
         this.addedUserFlag=true;
         console.log(response);
        //  this.selectedStaffsUuids = [userUuid];
        //  const staffToUpdate = this.staffs.find(staff => staff.uuid === userUuid);
        //  if (staffToUpdate) {
        //     staffToUpdate.isAdded = true;
    
        //   }
          this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
          // this.getFullLeaveSettingInformation();
          // this.requestLeaveCloseModel.nativeElement.click();
          this.helperService.showToast("Leave rules registered successfully", Key.TOAST_STATUS_SUCCESS);
        },
        (error) => {
          console.error('Error registering leave setting:', error);
          this.helperService.showToast(error.message, Key.TOAST_STATUS_ERROR);
        }
      );

    }
  }

  @ViewChild("leaveCategoryTab") leaveCategoryTab!: ElementRef;

  goToLeaveCategoryTab(){
    if(this.leaveSettingResponse.templateName==null){
      this.isFormValid = false;
      return;
    }
    this.errorTemplateNameFlag=false;
    this.leaveCategoryTab.nativeElement.click();
  }

  @ViewChild("staffSelectionTab") staffSelectionTab!: ElementRef;

  goToStaffSelectionTab(){
    this.staffSelectionTab.nativeElement.click();
  }

  rowNumberUser: number = 1;
  staffsUser: Staff[] = [];
  searchTextUser = '';
  pageNumberUser: number = 1;
  itemPerPageUser: number = 8;
  totalUser: number = 0;

  idOfLeaveSetting:number=0;

  searchSelectedUserPlaceholderFlag:boolean=false;

  crossFlagUser:boolean=false;

  searchLeaveUsers(leaveSettingId:number) {
    this.crossFlagUser=true;
    this.searchSelectedUserPlaceholderFlag=true;
    this.findUsersOfLeaveSetting(leaveSettingId);
    if(this.searchTextUser== ''){
      this.crossFlagUser=false;
    }
  
  }

  clearSearchSelectedUsers(){
    this.searchSelectedUserPlaceholderFlag=false;
    this.searchTextUser='';
    this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
    this.crossFlagUser = false;
  }
  isMappedStaffEmpty: boolean = false;
  findUsersOfLeaveSetting(leaveSettingId:number): void {
    this.selectedStaffsUuidsUser = []
    this.dataService.findUsersOfLeaveSetting(leaveSettingId, this.searchTextUser, this.pageNumberUser, this.itemPerPageUser)
      .subscribe((response) => {
        console.log(response + "response " + response.count + "count");
       
        this.staffsUser = response;
        
        this.staffsUser = response.users.map((staff: Staff) => ({
          ...staff,
          selected: this.selectedStaffsUuidsUser.includes(staff.uuid)
        }));
        this.totalUser = response.count;

        if(this.totalUser== 0){
          this.isMappedStaffEmpty = true;
        }else{
          this.isMappedStaffEmpty = false;
        }
       
  
        this.isAllSelectedUser = this.staffsUser.every(staff => staff.selected);
        
      });
  }

  // ############# pagination mapped user tab

  changeUserPage(newpage: number | string) {
    if (typeof newpage === 'number') {
      this.pageNumberUser = newpage;
    } else if (newpage === 'prev' && this.pageNumberUser > 1) {
      this.pageNumberUser--;
    } else if (newpage === 'next' && this.pageNumberUser < this.totalUserPages) {
      this.pageNumberUser++;
    }
    this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
  }

  getUserPages(): number[] {
    const totalUserPages = Math.ceil(this.totalUser / this.itemPerPageUser);
    return Array.from({ length: totalUserPages }, (_, index) => index + 1);
  }

  get totalUserPages(): number {
    return Math.ceil(this.totalUser / this.itemPerPageUser);
  }
  getUserStartIndex(): number {
    return (this.pageNumberUser - 1) * this.itemPerPageUser + 1;
  }
  getUserEndIndex(): number {
    const endIndex = this.pageNumberUser * this.itemPerPageUser;
    return endIndex > this.totalUser ? this.totalUser : endIndex;
  }

  onUserTableDataChange(event: any) {
    this.pageNumberUser = event;
  }

  // ########### Selection func....


  selectedStaffsUuidsUser: string[] = [];
  selectedStaffsUser: Staff[] = [];
  isAllSelectedUser: boolean = false;


  // isUserInLeaveRuleUser(userUuid: string): boolean {
  //   const userLeaveRule = this.fullLeaveSettingResponse.userLeaveRule;
  //   return userLeaveRule && userLeaveRule.length > 0 && userLeaveRule.some(rule => rule.userUuids.includes(userUuid));
  // }

  checkIndividualSelectionUser() {
    this.isAllUsersSelectedUser = this.staffsUser.every(staff => staff.selected);
    this.isAllSelectedUser = this.isAllUsersSelectedUser;
    this.updateSelectedStaffsUser();
  }

  checkAndUpdateAllSelectedUser() {
    this.isAllSelectedUser = this.staffsUser.length > 0 && this.staffsUser.every(staff => staff.selected);
    this.isAllUsersSelectedUser = this.selectedStaffsUuidsUser.length === this.totalUser;
  }

  updateSelectedStaffsUser() {
    this.staffsUser.forEach(staff => {
      if (staff.selected && !this.selectedStaffsUuidsUser.includes(staff.uuid)) {
        this.selectedStaffsUuidsUser.push(staff.uuid);
      } else if (!staff.selected && this.selectedStaffsUuidsUser.includes(staff.uuid)) {
        this.selectedStaffsUuidsUser = this.selectedStaffsUuidsUser.filter(uuid => uuid !== staff.uuid);
      }
    });

    this.checkAndUpdateAllSelectedUser();

  }
  isAllUsersSelectedUser: boolean = false;

  // Method to toggle all users' selection
  selectAllUsersUser(isChecked: boolean) {

    // const inputElement = event.target as HTMLInputElement;
    // const isChecked = inputElement ? inputElement.checked : false;
    this.isAllUsersSelectedUser = isChecked;
    this.isAllSelectedUser = isChecked; // Make sure this reflects the change on the current page
    this.staffsUser.forEach(staff => staff.selected = isChecked); // Update each staff's selected property

    if (isChecked) {  
      this.getAllUsersUuidsUser().then(allUuids => {
        this.selectedStaffsUuidsUser = allUuids;
      });
    } else {
      this.selectedStaffsUuidsUser = [];
      
    }

  }

  selectAllUser(checked: boolean) {
    this.isAllSelectedUser = checked;
    this.staffsUser.forEach(staff => staff.selected = checked);

    // Update the selectedStaffsUuids based on the current page selection
    if (checked) {
      // this.activeModel2 = true;
      this.staffsUser.forEach(staff => {
        if (!this.selectedStaffsUuidsUser.includes(staff.uuid)) {
          this.selectedStaffsUuidsUser.push(staff.uuid);
        }
      });
    } else {
      this.staffsUser.forEach(staff => {
        if (this.selectedStaffsUuidsUser.includes(staff.uuid)) {
          this.selectedStaffsUuidsUser = this.selectedStaffsUuidsUser.filter(uuid => uuid !== staff.uuid);
        }
      });
    }
  }



  async getAllUsersUuidsUser(): Promise<string[]> {
    
    const response = await this.dataService.findUsersOfLeaveSetting(this.idOfLeaveSetting, '', 1, this.totalUser).toPromise();
    return response.users.map((user: { uuid: any; }) => user.uuid);
    // return this.selectedStaffsUuidsUser;
  }

  onSelectAllUsersChangeUser(event: any) {
    this.selectAllUsersUser(event.target.checked);
  }

  unselectAllUsersUser() {
    this.isAllUsersSelectedUser = false;
    this.isAllSelectedUser = false;
    this.staffsUser.forEach(staff => staff.selected = false);
    this.selectedStaffsUuidsUser = [];
    // this.activeModel2 = false;
  }


  // ##########b 

  // 

  deleteAllUsers(): void {
    this.dataService.deleteAllUsersByLeaveSettingId(this.selectedStaffsUuidsUser).subscribe(() => {
      console.log('Users deleted successfully.');
      this.selectedStaffsUuids = [];
      this.selectedStaffsUuidsUser = [];
      this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
      this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
      // this.getLeaveSettingInformationById(this.idOfLeaveSetting);
      // this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
    });
  }

  deleteUser(userUuid:string): void {
    this.dataService.deleteUserFromUserLeaveRule(userUuid).subscribe(() => {
      this.selectedStaffsUuids = [];
      this.selectedStaffsUuidsUser = [];
      console.log('User deleted successfully.');
      this.getUserByFiltersMethodCall(this.idOfLeaveSetting);
      this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
    });
  }

  staffAddedFlag:boolean=false;
  addedUserFlag:boolean=false;
  errorTemplateNameFlag:boolean=false;
  addUser(userUuid:string, leaveSettingId:number): void {
    if(leaveSettingId==0){

    this.fullLeaveSettingRuleRequest.leaveSettingResponse = this.leaveSettingResponse;
    if(constant.EMPTY_STRINGS.includes(this.leaveSettingResponse.templateName)){
      this.errorTemplateNameFlag=true;
      this.templateSettingTab.nativeElement.click();
      return;
    }else{
      this.errorTemplateNameFlag=false;
    }
    const leaveSettingCategories = this.form.value.categories.map((category: any) => ({
      ...category
    }));
    this.fullLeaveSettingRuleRequest.leaveSettingCategoryResponse = leaveSettingCategories;
    this.fullLeaveSettingRuleRequest.userUuids = [userUuid];
    // selectedStaffsUuidsUser;

    this.dataService
      .registerLeaveSettingRules(this.fullLeaveSettingRuleRequest)
      .subscribe(
        (response) => {
          console.log('Leave rules registered successfully:', response);
          this.idOfLeaveSetting = response.leaveSettingResponse.id;
          // this.getFullLeaveSettingInformation();
          // this.requestLeaveCloseModel.nativeElement.click();
          this.isMappedStaffEmpty=false;
         this.addedUserFlag=true;
         console.log(response);
         this.selectedStaffsUuids = [userUuid];
         const staffToUpdate = this.staffs.find(staff => staff.uuid === userUuid);
         if (staffToUpdate) {
            staffToUpdate.isAdded = true;
            // this.staffAddedFlag=true;
          }
      this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
      // this.getLeaveSettingInformationById(this.idOfLeaveSetting);
      // this.selectedStaffsUuidsUser = [...this.selectedStaffsUuidsUser, userUuid];
        },
        (error) => {
          console.error('Error registering leave setting:', error);
        }
      );


    }else{
    this.dataService.addUserToLeaveRule(userUuid, leaveSettingId).subscribe((response) => {
      this.isMappedStaffEmpty=false;
      this.addedUserFlag=true;
      console.log(response);
      // this.selectedStaffsUuids = [userUuid];
      const staffToUpdate = this.staffs.find(staff => staff.uuid === userUuid);
      if (staffToUpdate) {
         staffToUpdate.isAdded = true;
        // this.staffAddedFlag=true;
     }
      this.findUsersOfLeaveSetting(this.idOfLeaveSetting);
      // this.selectedStaffsUuidsUser = [...this.selectedStaffsUuidsUser, userUuid];
    });
   }
  }
}
