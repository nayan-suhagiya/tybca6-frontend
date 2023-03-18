import { StaffService } from './../../services/staff.service';
import { DeptService } from './../../services/dept.service';
import { NgForm } from '@angular/forms';
import { Staff } from './../../models/Staff';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

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
        this.allDeptData = res;
        for (let dept of res) {
          if (!this.allDeptName.includes(dept.dname)) {
            this.allDeptName.push(dept.dname);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.getStaff().subscribe(
      (res) => {
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
        this.staffForm.reset();
        if (res.inserted) {
          Swal.fire('Success!', 'Staff Added!', 'success');

          this.ngOnInit();
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to add!', 'error');
      }
    );
  }

  editData(data: Staff) {
    this.editableStaff = data;
  }

  updateSubmit() {
    this.editableStaff.password = this.generatePassword(
      this.editableStaff.email,
      this.editableStaff.mobile
    );
    this.staffService.updateStaff(this.editableStaff).subscribe(
      (res) => {
        if (res.updated) {
          Swal.fire('Success!', 'Staff Update!', 'success');
          this.ngOnInit();
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to update!', 'error');
      }
    );
  }

  deleteData(empid: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.staffService.deleteStaff(empid).subscribe(
          (res) => {
            if (res.deleted) {
              this.ngOnInit();
            }
          },
          (err) => {
            Swal.fire('Oops!', 'Unable to delete!', 'error');
          }
        );
      }
    });
  }

  generateRandomEmpID() {
    this.staffData.empid = 'EMP' + Math.floor(100 + Math.random() * 900);
  }

  generatePassword(email: string, mobile: string) {
    const password = email.substring(0, 3) + mobile.substring(5);
    return password.toUpperCase();
  }

  updateDeptID(dname: string) {
    this.staffDept = this.allDeptData.filter((deptdata) => {
      return dname === deptdata.dname;
    });

    this.staffData.deptid = this.staffDept[0].deptid;
  }

  updateDeptIDEditable(dname: string) {
    const deptUpdateData = this.allDeptData.filter((deptdata) => {
      return dname === deptdata.dname;
    });

    this.editableStaff.deptid = deptUpdateData[0].deptid;
  }

  callNgOn() {
    this.ngOnInit();
  }

  resetForm() {
    this.staffForm.reset();
  }
}
