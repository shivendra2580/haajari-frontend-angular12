import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { error } from 'console';
import { template } from 'lodash';
import { FullLeaveSettingRequest } from 'src/app/models/Full-Leave-Setting-Request';
import { FullLeaveSettingResponse } from 'src/app/models/full-leave-setting-response';
import { LeaveSettingCategoryResponse } from 'src/app/models/leave-categories-response';
import { LeaveSettingResponse } from 'src/app/models/leave-setting-response';
import { Staff } from 'src/app/models/staff';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-leave-setting',
  templateUrl: './leave-setting.component.html',
  styleUrls: ['./leave-setting.component.css']
})
export class LeaveSettingComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {
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


  ngOnInit(): void {
    this.getUserByFiltersMethodCall();
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

  searchUsers() {
    this.getUserByFiltersMethodCall();
  }

  selectedStaffsUuids: string[] = [];
  selectedStaffs: Staff[] = [];
  isAllSelected: boolean = false;

  getUserByFiltersMethodCall() {
    this.dataService.getUsersByFilterForLeaveSetting(this.itemPerPage, this.pageNumber, 'asc', 'id', this.searchText, '').subscribe((response) => {
      this.staffs = response.users.map((staff: Staff) => ({
        ...staff,
        selected: this.selectedStaffsUuids.includes(staff.uuid)
      }));
      this.total = response.count;

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
    // Replace with your actual API call to get all users
    const response = await this.dataService.getAllUsers('asc', 'id', this.searchText, '').toPromise();
    return response.users.map((user: { uuid: any; }) => user.uuid);
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
    this.getUserByFiltersMethodCall();
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
    this.dataService.getLeaveSettingInformationById(leaveSettingId)
      .subscribe(response => {
        this.fullLeaveSettingResponse = response;
        this.findUsersOfLeaveSetting(leaveSettingId);
        this.leaveSettingResponse = this.fullLeaveSettingResponse.leaveSetting;
        this.selectedStaffsUuids =  this.fullLeaveSettingResponse.userUuids;
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

        this.getUserByFiltersMethodCall();

      }, error => {
        console.error('Error fetching leave setting information by ID:', error);
      });
  }
 @ViewChild("templateSettingTab") templateSettingTab!:ElementRef;
//  @ViewChild("leaveSettingForm") leaveSettingForm!:ElementRef;
//  leaveSettingForm!: NgForm;
  emptyAddLeaveSettingRule(){
    debugger
    this.templateSettingTab.nativeElement.click();
    this.unselectAllUsers();
    this.selectedStaffsUuids = [];
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
      },
      (error) => {
        console.error('Error deleting leave setting rule:', error);
      }
    );
  }



  // ###################### saveInOne ###################

  fullLeaveSettingRuleRequest : FullLeaveSettingRequest = new FullLeaveSettingRequest();
  @ViewChild("requestLeaveCloseModel") requestLeaveCloseModel!:ElementRef;
  

  saveLeaveSettingRules() {
    debugger
    this.fullLeaveSettingRuleRequest.leaveSettingResponse = this.leaveSettingResponse;
    const leaveSettingCategories = this.form.value.categories.map((category: any) => ({
      ...category
    }));
    this.fullLeaveSettingRuleRequest.leaveSettingCategoryResponse = leaveSettingCategories;
    this.fullLeaveSettingRuleRequest.userUuids = this.selectedStaffsUuids;

    this.dataService
      .registerLeaveSettingRules(this.fullLeaveSettingRuleRequest)
      .subscribe(
        (response) => {
          console.log('Leave rules registered successfully:', response);
          this.getFullLeaveSettingInformation();
          this.requestLeaveCloseModel.nativeElement.click();
        },
        (error) => {
          console.error('Error registering leave setting:', error);
        }
      );
  }

  @ViewChild("leaveCategoryTab") leaveCategoryTab!: ElementRef;

  goToLeaveCategoryTab(){
    if(this.leaveSettingResponse.templateName==null){
      this.isFormValid = false;
      return;
    }
    this.leaveCategoryTab.nativeElement.click();
  }

  @ViewChild("staffSelectionTab") staffSelectionTab!: ElementRef;

  goToStaffSelectionTab(){
    this.staffSelectionTab.nativeElement.click();
  }

  staffsUser: Staff[] = [];
  searchTextUser = '';
  pageNumberUser: number = 1;
  itemPerPageUser: number = 8;


  findUsersOfLeaveSetting(leaveSettingId:number): void {
    this.dataService.findUsersOfLeaveSetting(leaveSettingId, this.searchTextUser, this.pageNumberUser, this.itemPerPageUser)
      .subscribe((response) => {
        this.staffsUser = response;
        this.staffsUser = response.users.map((staff: Staff) => ({
          ...staff,
          selected: this.selectedStaffsUuids.includes(staff.uuid)
        }));
        this.total = response.count;
  
        // this.isAllSelected = this.staffsUser.every(staff => staff.selected);
        
      });
  }


}
