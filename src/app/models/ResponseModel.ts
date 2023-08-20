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
  approved: boolean;
}

export interface MailSend {
  mainSend: boolean;
}
