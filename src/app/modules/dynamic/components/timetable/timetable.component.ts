import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as dayjs from 'dayjs';
import { AttendenceDto } from 'src/app/models/attendence-dto';
// import { ChosenDate, TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

alwaysShowCalendars: boolean | undefined;
model: any;
  constructor(private dataService: DataService) { 
    this.setCurrentDate();
  }


  selected: { startDate: dayjs.Dayjs, endDate: dayjs.Dayjs } | null = null;
  myAttendanceData: Record<string, AttendenceDto[]> = {};

  ngOnInit(): void {
  
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = todayDate.getDate().toString().padStart(2, '0');
    this.inputDate = `${year}-${month}-${day}`;




    const today = dayjs();
    const oneWeekAgo = today.subtract(1, 'week');

    this.selected = {
      startDate: oneWeekAgo,
      endDate: today
    };
    this.updateDateRangeInputValue();
    this.getDataFromDate();
    this.getAttendanceDetailsByDateMethodCall();

  }


  dateRangeInputValue: string = '';

  totalAttendance: number = 0;
  attendanceArrayDate: any = [];


  dateRangeFilter(event: any): void {
    if (event.startDate && event.endDate) {
      // Use dayjs for date conversion
      this.selected = {
        startDate: dayjs(event.startDate),
        endDate: dayjs(event.endDate)
      };
      this.getDataFromDate();
    } else {
      this.selected = null;
    }

    this.updateDateRangeInputValue();

    const res3 = document.getElementById("date-picker-wrapper") as HTMLElement | null;
    if(res3){
      res3.style.display="none";
    }

    // const res2 = document.getElementById("date-picker-button") as HTMLElement | null;
    // if(res2){
    //   res2.style.display="block";
    // }

  }

  
  getDataFromDate(): void {
    if (this.selected) {
      const startDateStr: string = this.selected.startDate.startOf('day').format('YYYY-MM-DD');
      const endDateStr: string = this.selected.endDate.endOf('day').format('YYYY-MM-DD');
      
      
      this.dataService.getDurationDetails(this.getLoginDetailsId(), this.getLoginDetailsRole(), startDateStr, endDateStr).subscribe(
        
        (response: any) => {
          
          this.myAttendanceData = response;
          console.log(this.myAttendanceData);
          if (this.myAttendanceData) {
            
            for (const key in this.myAttendanceData) {
              
              if (this.myAttendanceData.hasOwnProperty(key)) {
                const attendanceArray = this.myAttendanceData[key];

                this.attendanceArrayDate=attendanceArray;
                
                // for (const element of attendanceArray) {
                //   if (element.checkInTime !== null) {
                    
                //     this.totalll += 1;
                //   }
                // }

                
              }
            }
          }
        },
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }
  
  getCurrentDate(){
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = todayDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  dateRangeButton(){
    const res = document.getElementById("date-picker-wrapper") as HTMLElement | null;
    if(res){
      res.style.display="block";
    }

    // const res2 = document.getElementById("date-picker-button") as HTMLElement | null;
    // if(res2){
    //   res2.style.display="none";
    // }

  }



  getLoginDetailsRole(){
    const loginDetails = localStorage.getItem('loginData');
    if(loginDetails!==null){
      const loginData = JSON.parse(loginDetails);
      if(this.checkingUserRoleMethod() === true){
        return 'MANAGER';
      }
      
      return loginData.role;
    }
  }

  getLoginDetailsId(){
    const loginDetails = localStorage.getItem('loginData');
    if(loginDetails!==null){
      const loginData = JSON.parse(loginDetails);
      return loginData.id;
    }
  }


  flag !: boolean;

  checkingUserRoleMethod(): boolean{ 
    this.dataService.checkingUserRole(this.getLoginDetailsId()).subscribe((data) => {
      this.flag = data;
      console.log(data);
    }, (error) => {
      console.log(error);
    })
    console.log(this.flag);
    
    return this.flag;
  }
  
  updateDateRangeInputValue(): void {
    if (this.selected) {
      this.dateRangeInputValue = `${this.selected.startDate.format('DD-MM-YYYY')} - ${this.selected.endDate.format('DD-MM-YYYY')}`;
    } else {
      this.dateRangeInputValue = '';
    }
  }








  // ###############################################################################

  selectedDate: string = ''; // To store the selected date
  currentDate: string = ''; // To store the current date in the format 'DD MMM YYYY'

  setCurrentDate() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    this.currentDate = today.toLocaleDateString('en-US', options);
    this.selectedDate = this.currentDate; // Set the selected date initially to today
  }

  onDateChange(event: any) {
    // Handle the date change logic here
    console.log('Selected date:', event.selectedDate);
  }

  selectPreviousDay() {
    debugger
    const currentDateObject = new Date(this.inputDate);
    currentDateObject.setDate(currentDateObject.getDate() - 1);
    this.inputDate = this.formatDate(currentDateObject);
    this.getAttendanceDetailsByDateMethodCall();
  }
  
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectNextDay() {
    const currentDateObject = new Date(this.inputDate);
    const tomorrow = new Date(currentDateObject);
    tomorrow.setDate(currentDateObject.getDate() + 1);

    // Disable the right arrow if the next day is equal to or greater than today
    if (tomorrow >= new Date()) {
      debugger
      return;
    }

    this.inputDate = this.formatDate(tomorrow);
    this.getAttendanceDetailsByDateMethodCall();
  }

  // formatDate(date: Date): string {
  //   const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  //   return date.toLocaleDateString('en-US', options);
  // }




  attendanceDataByDate: Record<string, AttendenceDto> = {};
  attendanceDataByDateKey : any = [];
  
  inputDate = '';
  getAttendanceDetailsByDateMethodCall(){

      this.dataService.getAttendanceDetailsByDate(this.getLoginDetailsId(), this.getLoginDetailsRole(), this.inputDate).subscribe((data) => {
        const keys = Object.keys(data);
        this.attendanceDataByDateKey = keys;

        this.attendanceDataByDate = data;
        console.log(this.attendanceDataByDateKey);
    }, (error) => {
      debugger
      console.log(error);
    })

  }



  // this.myAttendanceData = response;
  // console.log(this.myAttendanceData);
  // if (this.myAttendanceData) {
    
  //   for (const key in this.myAttendanceData) {
      
  //     if (this.myAttendanceData.hasOwnProperty(key)) {
  //       const attendanceArray = this.myAttendanceData[key];

  //       this.attendanceArrayDate=attendanceArray;
        
  //       // for (const element of attendanceArray) {
  //       //   if (element.checkInTime !== null) {
            
  //       //     this.totalll += 1;
  //       //   }
  //       // }

        
  //     }
  //   }
  // }


  optionsDatePicker: any = {
    autoApply: true,
    alwaysShowCalendars: false,
    showCancel: false,
    showClearButton: false,
    linkedCalendars: false,
    singleDatePicker: false,
    showWeekNumbers: false,
    showISOWeekNumbers: false,
    customRangeDirection: false,
    lockStartDate: false,
    closeOnAutoApply: true
  };

}

