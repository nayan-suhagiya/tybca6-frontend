import { StaffService } from './../../services/staff.service';
import { DeptService } from './../../services/dept.service';
import { NgForm } from '@angular/forms';
import { Staff } from './../../models/Staff';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-staff',
  templateUrl: './admin-staff.component.html',
  styleUrls: ['../admin.css'],
})
export class AdminStaffComponent implements OnInit {
  dpart = 'Staff';
  @ViewChild('staffForm') staffForm: NgForm;
  staffData: Staff = new Staff();
  imageSrc: string;
  allDeptData: any;
  staffDept: any;
  allDeptName: string[] = [];
  allStaffData: any;
  editableStaff: Staff = new Staff();

  constructor(
    private deptService: DeptService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.deptService.getDepartments().subscribe(
      (res) => {
        // console.log(res);
        this.allDeptData = res;
        for (let dept of res) {
          // console.log(dept);
          if (!this.allDeptName.includes(dept.dname)) {
            this.allDeptName.push(dept.dname);
          }
        }
        // console.log(this.allDeptName);
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.getStaff().subscribe(
      (res) => {
        // console.log(res);

        for (let i = 0; i < res.length; i++) {
          res[i].dob = moment(res[i].dob).format('YYYY-MM-DD');
          res[i].jdate = moment(res[i].jdate).format('YYYY-MM-DD');
        }
        this.allStaffData = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  staffFormSubmit() {
    this.staffData.password = this.generatePassword(
      this.staffData.email,
      this.staffData.mobile
    );

    this.staffService.addStaff(this.staffData).subscribe(
      (res) => {
        // console.log(res);
        this.staffForm.reset();
        if (res.inserted) {
          alert('Added!');
          this.ngOnInit();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editData(data: Staff) {
    this.editableStaff = data;
    // console.log(this.editableStaff);
  }

  updateSubmit() {
    this.editableStaff.password = this.generatePassword(
      this.editableStaff.email,
      this.editableStaff.mobile
    );
    // console.log(this.editableStaff);
    this.staffService.updateStaff(this.editableStaff).subscribe(
      (res) => {
        if (res.updated) {
          alert('updated!');
          this.ngOnInit();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteData(empid: string) {
    const conf = confirm('Are you sure?');

    if (conf) {
      this.staffService.deleteStaff(empid).subscribe(
        (res) => {
          // console.log(res);
          if (res.deleted) {
            // alert('deleted');
            this.ngOnInit();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  generateRandomEmpID() {
    this.staffData.empid = 'EMP' + Math.floor(100 + Math.random() * 900);
  }

  generatePassword(email: string, mobile: string) {
    const password = email.substring(0, 3) + mobile.substring(5);
    return password.toUpperCase();
  }

  updateDeptID(dname: string) {
    // console.log(dname);
    // console.log(this.allDeptData);

    this.staffDept = this.allDeptData.filter((deptdata) => {
      // console.log(deptdata.dname, deptdata.deptid);
      return dname === deptdata.dname;
    });

    // console.log(this.staffDept);

    this.staffData.deptid = this.staffDept[0].deptid;
  }

  updateDeptIDEditable(dname: string) {
    // console.log(dname);
    // console.log(this.allDeptData);

    const deptUpdateData = this.allDeptData.filter((deptdata) => {
      // console.log(deptdata.dname, deptdata.deptid);
      return dname === deptdata.dname;
    });

    // console.log(deptUpdateData);

    this.editableStaff.deptid = deptUpdateData[0].deptid;
  }

  callNgOn() {
    this.ngOnInit();
  }

  resetForm() {
    this.staffForm.reset();
  }
}
