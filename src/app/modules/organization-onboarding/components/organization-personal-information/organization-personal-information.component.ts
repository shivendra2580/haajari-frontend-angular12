
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';



import { OrganizationPersonalInformation } from 'src/app/models/organization-personal-information';
import { DataService } from 'src/app/services/data.service';
import { OrganizationOnboardingService } from 'src/app/services/organization-onboarding.service';


@Component({
  selector: 'app-organization-personal-information',
  templateUrl: './organization-personal-information.component.html',
  styleUrls: ['./organization-personal-information.component.css']
})
export class OrganizationPersonalInformationComponent implements OnInit {

  constructor(private dataService: DataService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private afStorage: AngularFireStorage,
    private _onboardingService: OrganizationOnboardingService) { }

  ngOnInit(): void {
    this.getOrganizationDetails();
  }

  isNumberExist: boolean = false;
  checkExistance(number:string){
    if(number != '' && number.length>=10){
      this._onboardingService.checkNumberExist(number).subscribe((response: any) => {
          this.isNumberExist = response;
      }, (error) => {
        console.log(error);
        
      })
    }
    

  }

  organizationPersonalInformation: OrganizationPersonalInformation = {
    id: 0,
    adminName: '',
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
      configureUrl: "",
      onboardingVia:  ""
    }
  };

  loading: boolean = false;
  registerOrganizationPersonalInformation() {
    this.loading = true;
    this.dataService.registerOrganizationPersonalInformation(this.organizationPersonalInformation)
      .subscribe(response => {
        this.loading = false;
        console.log("organization personal Info Registered Successfully");
        this.router.navigate(['/organization-onboarding/holiday-setting']);
        this.dataService.markStepAsCompleted(2);
        this._onboardingService.saveOrgOnboardingStep(2).subscribe();
      }, (error) => {
        this.loading = false;
        console.log(error.error.message);
      });
  }

  getOrganizationDetails() {
    debugger
    this.dataService.getOrganizationDetails().subscribe((data) => {
      this.organizationPersonalInformation = data;
      // console.log(this.organizationPersonalInformation);
      //   if (data.logo) {
      //     this.setImageUrlFromDatabase(data.logo);
      // }
    }, (error) => {
      console.log(error);
    });
  }

  // dbImageUrl: string | null = null;

  // setImageUrlFromDatabase(url: string) {
  //     this.dbImageUrl = url;
  // }

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
  @ViewChild('personalInformationForm') personalInformationForm !: NgForm
  checkFormValidation() {
    if (this.personalInformationForm.invalid) {
      this.isFormInvalid = true;
      return
    } else {
      this.isFormInvalid = false;
    }
  }

  submit() {
    this.checkFormValidation();

    if (this.isFormInvalid == true) {
      return
    } else {
      this.registerOrganizationPersonalInformation();
    }
  }

  showNewPassword: boolean = false
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
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
          // this.imagePreviewUrl = e.target.result;
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
    const validExtensions = ['jpg', 'jpeg', 'png', 'svg'];
    const fileType = file.type.split('/').pop(); // Get the file extension from the MIME type

    if (fileType && validExtensions.includes(fileType.toLowerCase())) {
      this.isInvalidFileType = false;
      return true;
    }
    console.log(this.isInvalidFileType);
    this.isInvalidFileType = true;
    return false;
  }

  getImageUrl(e: any) {
    console.log(e);
    if (e != null && e.length > 0) {

    }
  }


  uploadImageLoader: boolean = false;
  uploadFile(file: File): void {
    debugger
    this.uploadImageLoader = true;
    const filePath = `logo/${new Date().getTime()}_${file.name}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);

    task.snapshotChanges().toPromise().then(() => {
      console.log("Upload completed");
      fileRef.getDownloadURL().toPromise().then(url => {
        console.log("File URL:", url);
        this.organizationPersonalInformation.logo = url;

        this.uploadImageLoader = false;
      }).catch(error => {
        console.error("Failed to get download URL", error);
      });
    }).catch(error => {
      console.error("Error in upload snapshotChanges:", error);
    });


  }

  @ViewChild("placesRef") placesRef!: GooglePlaceDirective;

  public handleAddressChange(e: any) {
    debugger
    this.organizationPersonalInformation.addressLine1 = e.formatted_address.toString();
    e?.address_components?.forEach((entry: any) => {
      console.log(entry);
      if (entry.types?.[0] === "locality") {
        this.organizationPersonalInformation.city = entry.long_name
      }
      if (entry.types?.[0] === "administrative_area_level_1") {
        this.organizationPersonalInformation.state = entry.long_name
      }
      if (entry.types?.[0] === "country") {
        this.organizationPersonalInformation.country = entry.long_name
      }
      if (entry.types?.[0] === "postal_code") {
        this.organizationPersonalInformation.pincode = entry.long_name
      }

    });
  }

  removeImage() {
    this.organizationPersonalInformation.logo = '';
  }

}
