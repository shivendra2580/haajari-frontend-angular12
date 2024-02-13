import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Key } from 'src/app/constant/key';
import { EmployeeAttendanceLocation } from 'src/app/models/employee-attendance-location';
import { DataService } from 'src/app/services/data.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-employee-attendance-photo',
  templateUrl: './employee-attendance-photo.component.html',
  styleUrls: ['./employee-attendance-photo.component.css']
})
export class EmployeeAttendancePhotoComponent implements OnInit {

  private trigger: Subject<any>  = new Subject();

    public webcamImage!: WebcamImage;
    private nextWebcam: Subject<any>  = new Subject();
    employeeAttendanceLocation : EmployeeAttendanceLocation =  new EmployeeAttendanceLocation ();
    captureImage  = '';

  constructor(private dataService: DataService, private router: Router, private activateRoute: ActivatedRoute, private helper : HelperService, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    if(this.dataService.lat == 0 && this.dataService.lng == 0 ) {
      this.helper.showToast("Please Fetch Your Current Location Again!", Key.TOAST_STATUS_ERROR);
      setTimeout(x=>{

      let navExtra: NavigationExtras = {
        queryParams: { userUuid: new URLSearchParams(window.location.search).get('userUuid') },
      };
      this.router.navigate(['/attendance-photo'], navExtra);
    }, 2000);
    }
  }

  routeToLocationValidator() {
    let navExtra: NavigationExtras = {
      queryParams: { userUuid: new URLSearchParams(window.location.search).get('userUuid') },
    };
    this.router.navigate(['/location-validator'], navExtra);
  }

  toggle = false;
markAttendaceWithLocationMethodCall(){
  // this.getCurrentLocation();
  debugger
  // this.uploadFile(this.imageFile, 'webcamImage');
  const userUuid = new URLSearchParams(window.location.search).get('userUuid') || '';
  this.employeeAttendanceLocation.latitude = this.dataService.lat.toString();
  this.employeeAttendanceLocation.longitude = this.dataService.lng.toString();
  this.employeeAttendanceLocation.distance = this.dataService.radius;
  
  this.dataService.markAttendaceWithLocation(this.employeeAttendanceLocation, userUuid)
  .subscribe(
    (response: EmployeeAttendanceLocation) => {
      console.log(response);  
      if(response.status=='Already Checked In'){
        this.helper.showToast("You're Already Checked In", Key.TOAST_STATUS_ERROR);
      }

      if(response.status=='In'){
        this.helper.showToast("You're Successfully Checked In", Key.TOAST_STATUS_SUCCESS);
        this.toggle = true;
      }
    this.toggle = false;
      
    },
    (error) => {
      console.error(error);
      
    })
 
  ;
}


  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<any>  {

    return this.trigger.asObservable();
}

  public get nextWebcamObservable(): Observable<any>  {

    return this.nextWebcam.asObservable();
  }
  
   dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
  
    if (match) {
        const mime = match[1];
  
  
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
  
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    } else {
        throw new Error('Invalid data URL');
    }
  }
  
  imageFile:any;
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.captureImage = webcamImage.imageAsDataUrl;
    console.info('received webcam image', this.captureImage);
  
    // Convert Data URL to Blob
    const imageBlob = this.dataURLtoBlob(this.captureImage);
  
    // Create a file from Blob
    this.imageFile = new File([imageBlob], "captured_image.png", { type: 'image/png' });
    console.log(this.imageFile);
    // Upload file to Firebase
    this.uploadFile(this.imageFile, 'webcamImage');
  }
  
  uploadFile(imageFile: File, documentType: string): void {
    debugger
    const filePath = `documents/${new Date().getTime()}_${imageFile.name}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, imageFile);
  
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(
          url => {
            console.log(url);
            this.employeeAttendanceLocation.imageUrl = url;
            
          },
          error => {
            console.error("Error getting download URL:", error);
           
          }
        );
      })
    ).subscribe(
      () => {
        console.log('Upload snapshotChanges observable received an event');
      },
      error => {
        console.error("Error during file upload:", error);
        
      }
    );
  }
}
