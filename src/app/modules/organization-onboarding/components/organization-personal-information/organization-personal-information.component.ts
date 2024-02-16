
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


import { OrganizationPersonalInformation } from 'src/app/models/organization-personal-information';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-organization-personal-information',
  templateUrl: './organization-personal-information.component.html',
  styleUrls: ['./organization-personal-information.component.css']
})
export class OrganizationPersonalInformationComponent implements OnInit {

  constructor(private dataService:DataService, private router: Router, private activateRoute: ActivatedRoute, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getOrganizationDetails();
  }


  organizationPersonalInformation: OrganizationPersonalInformation = {
    id: 0,
    name: '',
    email: '',
    password: '',
    state: '',
    country: '',
    logo: '',
    city: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    organization: {
      id: 0,
      name: "",
      email: "",
      password: "",
      country: 0,
      state: "",
      token: "",
      webhook: "",
      appId: "",
      userToken: "",
      configureUrl: ""
    }
  };
 

  registerOrganizationPersonalInformation() {
    this.dataService.registerOrganizationPersonalInformation(this.organizationPersonalInformation)
      .subscribe(response => {
        console.log("organization personal Info Registered Successfully");

      },(error) => {
          console.log(error.error.message);
      });
  }

  getOrganizationDetails(){
    debugger
    this.dataService.getOrganizationDetails().subscribe(
      (data)=> {
          this.organizationPersonalInformation = data;          
          console.log(this.organizationPersonalInformation);
      }, (error) => {
        console.log(error);
      });
  }

  preventLeadingWhitespace(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
  
    // Prevent space if it's the first character
    if (event.key === ' ' && inputElement.value.length === 0) {
      event.preventDefault();
  }
    // if (!isNaN(Number(event.key)) && event.key !== ' ') {
    //   event.preventDefault();
    // }
  }

  preventLeadingWhitespaceAndNumber(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
  
    // Prevent space if it's the first character
    if (event.key === ' ' && inputElement.selectionStart === 0) {
      event.preventDefault();
    }
    if (!isNaN(Number(event.key)) && event.key !== ' ') {
      event.preventDefault();
    }
  }

  
  isFormInvalid: boolean = false;
  @ViewChild ('personalInformationForm') personalInformationForm !: NgForm
checkFormValidation(){
  if(this.personalInformationForm.invalid){
  this.isFormInvalid = true;
  return
  } else {
    this.isFormInvalid = false;
  }
}

submit(){
  this.checkFormValidation();

  if(this.isFormInvalid==true){
    return
  } else{
    this.registerOrganizationPersonalInformation();
  }
}

selectedFile: File | null = null;
isFileSelected = false;
imagePreviewUrl: any = null;
onFileSelected(event: Event): void {
  debugger
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;

  if (fileList && fileList.length > 0) {
    const file = fileList[0];

    // Check if the file type is valid
    if (this.isValidFileType(file)) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Set the loaded image as the preview
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadFile(file);
    } else {
      element.value = '';
      this.organizationPersonalInformation.logo = '';
      // Handle invalid file type here (e.g., show an error message)
      console.error('Invalid file type. Please select a jpg, jpeg, or png file.');
    }
  } else {
    this.isFileSelected = false;
  }
}

// Helper function to check if the file type is valid
isInvalidFileType = false; 
isValidFileType(file: File): boolean {
  const validExtensions = ['jpg', 'jpeg', 'png'];
  const fileType = file.type.split('/').pop(); // Get the file extension from the MIME type

  if (fileType && validExtensions.includes(fileType.toLowerCase())) {
    this.isInvalidFileType = false;
    return true;
  }
  console.log(this.isInvalidFileType);
  this.isInvalidFileType = true;
  return false;
}

getImageUrl(e: any){
  console.log(e);
  if(e!=null && e.length>0){
  
  }
}



uploadFile(file: File): void {
  debugger
  const filePath = `logo/${new Date().getTime()}_${file.name}`;
  const fileRef = this.afStorage.ref(filePath);
  const task = this.afStorage.upload(filePath, file);

  task.snapshotChanges().toPromise().then(() => {
    console.log("Upload completed");
    fileRef.getDownloadURL().toPromise().then(url => {
      console.log("File URL:", url);
      this.organizationPersonalInformation.logo = url;
    }).catch(error => {
      console.error("Failed to get download URL", error);
    });
  }).catch(error => {
    console.error("Error in upload snapshotChanges:", error);
  });
  
  
}

}
