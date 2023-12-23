import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NavigationExtras, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserDocumentsDetailsRequest } from 'src/app/models/user-documents-details-request';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-employee-document',
  templateUrl: './employee-document.component.html',
  styleUrls: ['./employee-document.component.css']
})
export class EmployeeDocumentComponent implements OnInit {


  userDocumentsDetailsRequest: UserDocumentsDetailsRequest = new UserDocumentsDetailsRequest();
selectedHighSchoolCertificateFileName: any;
  constructor(private router : Router, private dataService : DataService, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getEmployeeDocumentsDetailsMethodCall();
  }
  
  backRedirectUrl(){
    let navExtra: NavigationExtras = {
      queryParams: { userUuid: new URLSearchParams(window.location.search).get('userUuid') },
    };
    this.router.navigate(['/employee-address-detail'], navExtra);
  }

  userDocumentsStatus = "";


  routeToUserDetails() {
    let navExtra: NavigationExtras = {
      queryParams: { userUuid: new URLSearchParams(window.location.search).get('userUuid') },
    };
    this.router.navigate(['/acadmic'], navExtra);
  }

  // onFileSelected(event: any, documentType: string): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.uploadFile(file, documentType);
  //   }
  // }
  selectedSecondarySchoolFileName: string = '';
  selectedHighSchoolFileName: string = '';
  selectedHighestQualificationDegreeFileName: string = '';
  selectedTestimonialReccomendationFileName: string = '';

  onFileSelected(event: Event, documentType: string): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const file = fileList[0];
      if (documentType === 'secondarySchoolCertificate') {
        this.selectedSecondarySchoolFileName = file.name;
      }
      if (documentType === 'highSchoolCertificate') {
        this.selectedHighSchoolFileName = file.name;
      }
      if (documentType === 'highestQualificationDegree') {
        this.selectedHighestQualificationDegreeFileName = file.name;
      }
      if (documentType === 'testimonialReccomendation') {
        this.selectedTestimonialReccomendationFileName = file.name;
      }
      // this.selectedFileName = file.name;
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
       
        const imagePreview: HTMLImageElement = document.getElementById('imagePreview') as HTMLImageElement;
        imagePreview.src = e.target.result;
      };
  
      reader.readAsDataURL(file);
      this.uploadFile(file, documentType);
    }
  }
  
  uploadFile(file: File, documentType: string): void {
    const filePath = `documents/${new Date().getTime()}_${file.name}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
  
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
        
          this.assignDocumentUrl(documentType, url);
          
          // this.setEmployeeDocumentsDetailsMethodCall();
        });
      })
    ).subscribe();
  }
  
  assignDocumentUrl(documentType: string, url: string): void {
    switch (documentType) {
      case 'secondarySchoolCertificate':
        this.userDocumentsDetailsRequest.secondarySchoolCertificate = url;
        break;
      case 'highSchoolCertificate':
        this.userDocumentsDetailsRequest.highSchoolCertificate = url;
        break;
      case 'highestQualificationDegree':
        this.userDocumentsDetailsRequest.highestQualificationDegree = url;
        break;
      case 'testimonialReccomendation':
        this.userDocumentsDetailsRequest.testimonialReccomendation = url;
        break;
      
    }
  }

  selectedFile: File | null = null;
  toggle = false;
  setEmployeeDocumentsDetailsMethodCall(): void {
    debugger
    this.toggle = true;
    const userUuid = new URLSearchParams(window.location.search).get('userUuid') || '';
    if(this.selectedFile) {
     
      this.uploadFile(this.selectedFile, 'string');
  }

  this.dataService.setEmployeeDocumentsDetails(this.userDocumentsDetailsRequest, userUuid)
    
  .subscribe(
    (response: UserDocumentsDetailsRequest) => {
      console.log('Response:', response);
      console.log(this.userDocumentsDetailsRequest);
      this.toggle = false
      // Perform further actions like navigation or state updates
      this.routeToUserDetails();
    },
    (error) => {
      console.error('Error occurred:', error);
      this.toggle = false
    }
    
  );

    if (!userUuid) {
      console.error('User UUID is missing.');
      return;
    }
  
    
    this.dataService.markStepAsCompleted(3);
  
    
    
  }
  

  // Properties to hold filenames extracted from URLs
secondarySchoolCertificateFileName: string = '';
highSchoolCertificateFileName1: string = '';
highestQualificationDegreeFileName1: string = '';
testimonialReccomendationFileName1: string = '';

// Properties to determine if the file input should be required
isSecondarySchoolCertificateRequired: boolean = true;
isHighSchoolCertificateRequired: boolean = true;
isHighestQualificationDegreeRequired: boolean = true;



  getEmployeeDocumentsDetailsMethodCall() {
    debugger
    const userUuid = new URLSearchParams(window.location.search).get('userUuid');
  
    if (userUuid) {
      this.dataService.getEmployeeDocumentDetails(userUuid).subscribe(
        (response: UserDocumentsDetailsRequest) => {
          this.userDocumentsDetailsRequest = response;
          console.log(response);
          this.secondarySchoolCertificateFileName = this.getFilenameFromUrl(response.secondarySchoolCertificate);
        this.isSecondarySchoolCertificateRequired = !response.secondarySchoolCertificate;

        this.highSchoolCertificateFileName1 = this.getFilenameFromUrl(response.highSchoolCertificate);
        this.isHighSchoolCertificateRequired = !response.highSchoolCertificate;

        this.highestQualificationDegreeFileName1 = this.getFilenameFromUrl(response.highestQualificationDegree);
        this.isHighestQualificationDegreeRequired = !response.highestQualificationDegree;

          this.testimonialReccomendationFileName1 = this.getFilenameFromUrl(response.testimonialReccomendation);

          this.dataService.markStepAsCompleted(3);
        },
        (error: any) => {
          console.error('Error fetching user details:', error);
          
        }
      );
    } else {
      console.error('uuidNewUser not found in localStorage');
      
    }
  } 

  getFilenameFromUrl(url: string): string {
    if (!url) return '';
    
    const decodedUrl = decodeURIComponent(url);
   
    const parts = decodedUrl.split('/');
    
    const filenameWithQuery = parts.pop() || '';
    
    const filename = filenameWithQuery.split('?')[0];
   
    const cleanFilename = filename.replace(/^\d+_/,'');
    return cleanFilename;
  }
  
  
}
