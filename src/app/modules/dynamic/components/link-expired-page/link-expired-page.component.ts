import { Component, OnInit } from '@angular/core';
import { Key } from 'src/app/constant/key';
import { UserPersonalInformationRequest } from 'src/app/models/user-personal-information-request';
import { DataService } from 'src/app/services/data.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-link-expired-page',
  templateUrl: './link-expired-page.component.html',
  styleUrls: ['./link-expired-page.component.css']
})
export class LinkExpiredPageComponent implements OnInit {

  userPersonalInformation: UserPersonalInformationRequest = new UserPersonalInformationRequest();
  constructor(private dataservice: DataService, private helper : HelperService) { }

  ngOnInit(): void {
  }

  sendNewAttendanceLink() {
    debugger
    const userUuid = new URLSearchParams(window.location.search).get('userUuid');

    if (userUuid) {
      this.dataservice.generateNewAttendanceLink(userUuid).subscribe(
        (response) => {
          // Handle the response here
          console.log('Attendance link generated:', response);
          this.helper.showToast("New Link Sent Successfully", Key.TOAST_STATUS_SUCCESS);
          window.location.href = 'https://api.whatsapp.com/send/?phone=918799754156&type=phone_number&app_absent=0';
          // You might want to do something with the response, like displaying a message or redirecting the user
        },
        (error) => {
          // Handle any errors here
          console.error('Error generating new attendance link:', error);
        }
      );
    } else {
      console.error('User UUID not found in the URL');
    }
  }
}
