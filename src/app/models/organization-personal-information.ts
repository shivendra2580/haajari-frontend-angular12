import { Organization } from "./organization";


export class OrganizationPersonalInformation {

  id: number=0;
  name: string='';
  email: string='';
  password: string='';
  state: string='';
  country: string='';
  logo: string='';
//   organizationPic!: any; 
  organization: Organization=new Organization();
}
