import { TeamWithoutUsersResponse } from "./team-without-users-response";

export class LateEmployeeAttendanceDetailsResponse {

    uuid : string = '';
    name : string = '';
    email : string = '';
    image : string = '';
    date : string = '';
    checkInTime : string = '';
    lateDuration : string = '';
    managers : string[] = [];
    // teams : TeamWithoutUsersResponse[] = [];
    
}
