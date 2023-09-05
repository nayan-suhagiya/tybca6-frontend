export interface Insert {
  deptid?: number;
  empid?: number;
  emailExist?: boolean;
  mobileExist?: boolean;
  inserted: boolean;
}

export interface Update {
  deptid?: number;
  empid?: string;
  added?: boolean;
  updated: boolean;
}

export interface Delete {
  deptid?: number;
  empid?: number;
  deleted: boolean;
}

export interface AllLeave {
  leavedate: string;
}

export interface Approve {
  empid: string;
  offday?: boolean;
  approved: boolean;
}

export interface MailSend {
  mainSend: boolean;
}

export interface Founded {
  founded: boolean;
}

export interface Present {
  present: boolean;
}

export interface CheckInData {
  empid: string;
  checkin: Date;
  checkout: Date;
  date: Date;
  token: string;
}

export interface AbsentData {
  empid: string;
  month: string;
  year: string;
  date: Date[];
}
