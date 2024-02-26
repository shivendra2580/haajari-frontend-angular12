import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Key } from 'src/app/constant/key';
import { EmployeeAttendanceLocation } from 'src/app/models/employee-attendance-location';
import { OrganizationAddressDetail } from 'src/app/models/organization-address-detail';
import { DataService } from 'src/app/services/data.service';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
declare var google: any;
@Component({
  selector: 'app-employee-location-validator',
  templateUrl: './employee-location-validator.component.html',
  styleUrls: ['./employee-location-validator.component.css']
})

export class EmployeeLocationValidatorComponent implements OnInit {

  private trigger: Subject<any>  = new Subject();

    public webcamImage!: WebcamImage;
    private nextWebcam: Subject<any>  = new Subject();

    captureImage  = '';

  employeeAttendanceLocation : EmployeeAttendanceLocation =  new EmployeeAttendanceLocation ();
  organizationAddressDetail : OrganizationAddressDetail = new OrganizationAddressDetail();
  lat: number=0;
  lng: number=0;
  zoom: number = 15; // Initial zoom level of the map
  markerPosition: any;
  attendanceMode: number=0;

  constructor(private dataService: DataService, private router: Router, private activateRoute: ActivatedRoute, private helper : HelperService, private afStorage: AngularFireStorage) { 
    // if (this.activateRoute.snapshot.queryParamMap.has('userId')) {
    //   this.userId = this.activateRoute.snapshot.queryParamMap.get('userId');
    // }
  }

  ngOnInit(): void {
    this.checkAttendanceLocationLinkStatusMethodCall();
    const userUuid = new URLSearchParams(window.location.search).get('userUuid');
    let navExtra: NavigationExtras = {
      queryParams: { userUuid: userUuid},
    };
    // this.router.navigate(['/location-validator'], navExtra);
    
  }

  // uniqueId: string = '';
  // saveUniqueId(){
  //   const uniqueId = new URLSearchParams(window.location.search).get('uniqueId');
  //   if(uniqueId){
  //     this.uniqueId = uniqueId;
  //   } 
  // }


  routeToEmployeePhoto() {
    let navExtra: NavigationExtras = {
      queryParams: { userUuid: new URLSearchParams(window.location.search).get('userUuid') },
    };
    this.router.navigate(['/attendance-photo'], navExtra);
  }

  enableSubmitToggle:boolean=false;
  address: string = ''; // Add this property to hold the fetched address
  city: string = '';
   getCurrentLocation() {
    debugger
    if(this.address != ''){
      this.address = '';
    }
    if ('geolocation' in navigator) {
      
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.markerPosition = { lat: this.lat, lng: this.lng };
        console.log(this.lat+"-"+this.lng);

         // Initialize the Geocoder
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: this.lat, lng: this.lng };
      geocoder.geocode({ 'location':  latlng  }, (results: { formatted_address: string; }[], status: string) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const address = results[0].formatted_address;
            //@ts-ignore
            this.city = results[0].address_components[2].long_name;
            this.address  = address;
            console.log(address); // Log the address to console or update the UI as needed
            this.enableSubmitToggle=true;
            (document.getElementById('exampleInputText') as HTMLInputElement).value = address; // Update the input field with address
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
      
        
      });
    }
  }

  

  
 
   calculateDistance(){
    this.enableSubmitToggle=false;
    var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat, this.lng), new google.maps.LatLng(Number(this.organizationLat),Number(this.OrganizationLong)));       
    console.log(distance+"---"+this.radius);
    if(distance>this.radius){
      this.toggle = false;
    
    this.helper.showToast("Oops! Looks like you're not close enough to the company to mark your attendance. Please try again when you're nearby!", Key.TOAST_STATUS_ERROR);
    console.log("cannot mark attendance");
  }else{
    this.toggle = false;
// this.enableSubmitToggle=true;
// this.markAttendaceWithLocationMethodCall();
if(this.attendanceMode==3){


this.dataService.saveEmployeeCurrentLocationLatLng(this.lat, this.lng, this.radius, this.attendanceMode);
this.routeToEmployeePhoto();
} else if (this.attendanceMode==2){
  this.markAttendaceWithLocationMethodCall();
  
}
  }
    
  }

  radius: string="" ;
  organizationLat: string | undefined ;
  OrganizationLong: string | undefined ;

  getOrganizationLatLongMethodCall(){
    debugger
    
    const userUuid = new URLSearchParams(window.location.search).get('userUuid');
    if (userUuid) {
    this.dataService.getOrganizationLatLong(userUuid).subscribe(
      (response: OrganizationAddressDetail) => {
          if (response) {
            console.log(response);
              this.organizationAddressDetail = response;
              this.radius = response.radius;
              
              this.organizationLat = response.latitude;
              this.OrganizationLong = response.longitude;
              this.attendanceMode = response.attendanceMode;
              // this.getCurrentLocation();
          } else {
              console.log('No address details found');
          }
      },
      (error: any) => {
          console.error('Error fetching address details:', error);
      }
      
  );

  } else {
    console.error('userUuid not found');
}
}

toggle = false;
markAttendaceWithLocationMethodCall(){
  // this.getCurrentLocation();
  debugger
  // this.uploadFile(this.imageFile, 'webcamImage');
  const userUuid = new URLSearchParams(window.location.search).get('userUuid') || '';
  this.employeeAttendanceLocation.latitude = this.lat.toString();
  this.employeeAttendanceLocation.longitude = this.lng.toString();
  this.employeeAttendanceLocation.distance = this.radius;
  
  this.dataService.markAttendaceWithLocation(this.employeeAttendanceLocation, userUuid)
  .subscribe(
    (response: EmployeeAttendanceLocation) => {
      console.log(response); 
      this.enableSubmitToggle=true; 
      if(response.status=='Already Checked In'){
        this.helper.showToast("You're Already Checked In", Key.TOAST_STATUS_ERROR);
      }

      if(response.status=='In'){
        this.helper.showToast("You're Successfully Checked In", Key.TOAST_STATUS_SUCCESS);
        this.toggle = true;
        window.location.href = 'https://api.whatsapp.com/send/?phone=918799754156&type=phone_number&app_absent=0';
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

  //   public handleImage(webcamImage: WebcamImage): void {
  //     this.webcamImage = webcamImage;
  //     this.captureImage = webcamImage!.imageAsDataUrl;
  //     console.info('received webcam image', this.captureImage);
  // }

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

isInvalid: boolean = false;
checkAttendanceLocationLinkStatusMethodCall() {
  
  const uniqueId = new URLSearchParams(window.location.search).get('uniqueId');
  if (uniqueId) {
    this.dataService.checkAttendanceLocationLinkStatus(uniqueId).subscribe({
      next: (response) => { 
        this.getOrganizationLatLongMethodCall();
        this.getCurrentLocation();
        console.log('Link status:', response);
      },
      error: (error) => { 
        this.isInvalid = true;
        console.error('Error fetching link status:', error);
      }
    });
  } else {
    this.isInvalid = true;
    console.error('No uniqueId found in the URL');
  }
}



}
