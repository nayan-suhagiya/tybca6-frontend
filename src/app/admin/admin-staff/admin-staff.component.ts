import { StaffService } from './../../services/staff.service';
import { DeptService } from './../../services/dept.service';
import { NgForm } from '@angular/forms';
import { Staff } from './../../models/Staff';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-staff',
  templateUrl: './admin-staff.component.html',
  styleUrls: ['../main.css'],
})
export class AdminStaffComponent implements OnInit {
  dpart = 'Staff';
  @ViewChild('staffForm') staffForm: NgForm;
  staffData: Staff = new Staff();
  imageSrc: string = '';
  allDeptData: any;
  staffDept: any;
  allDeptName: string[] = [];
  allStaffData: any;
  editableStaff: Staff = new Staff();

  constructor(
    private deptService: DeptService,
    private staffService: StaffService,
    private spinner: NgxSpinnerService
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
        this.allStaffData = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  staffFormSubmit() {
    // console.log(this.staffData.profile);
    this.spinner.show();
    this.staffData.password = this.generatePassword(
      this.staffData.email,
      this.staffData.mobile
    );

    this.staffService.addStaff(this.staffData).subscribe(
      (res) => {
        this.staffForm.reset();
        if (res.inserted) {
          Swal.fire('Success!', 'Staff Added!', 'success');
          this.spinner.hide();
          this.ngOnInit();
          this.imageSrc = '';
        } else {
          if (res.emailExist) {
            Swal.fire('Error!', 'Email Already Exists!', 'error');
            this.spinner.hide();
          } else {
            if (res.mobileExist) {
              Swal.fire('Error!', 'Mobile Number Already Exists!', 'error');
              this.spinner.hide();
            }
          }
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to add!', 'error');
        this.spinner.hide();
      }
    );
  }

  editData(data: Staff) {
    // console.log(data);
    this.editableStaff = data;
    this.editableStaff.jdate = moment(this.editableStaff.jdate).format(
      'YYYY-MM-DD'
    );
    this.editableStaff.dob = moment(this.editableStaff.dob).format(
      'YYYY-MM-DD'
    );
    this.imageSrc = data.profile;
  }

  updateSubmit() {
    // console.log(this.editableStaff);
    this.spinner.show();
    this.editableStaff.password = this.generatePassword(
      this.editableStaff.email,
      this.editableStaff.mobile
    );
    this.staffService.updateStaff(this.editableStaff).subscribe(
      (res) => {
        if (res.updated) {
          Swal.fire('Success!', 'Staff Update!', 'success');
          this.spinner.hide();
          this.ngOnInit();
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to update!', 'error');
        this.spinner.hide();
      }
    );
  }

  deleteData(empid: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All staff reletade will be deleted!',
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

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    var fileSize = Math.round(file.size / 1024);
    console.log(fileSize);

    if (fileSize <= 600) {
      // alert('Uploaded');
    } else {
      // alert('Error! File too large');
      Swal.fire(
        'Error',
        'File too large!Please upload Maximum 8kb size image!',
        'error'
      );
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.staffData.profile = reader.result;
  }

  updatePhotoForStaffUpdate(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    var fileSize = Math.round(file.size / 1024);
    console.log(fileSize);

    if (fileSize <= 600) {
      // alert('Uploaded');
    } else {
      // alert('Error! File too large');
      Swal.fire(
        'Error',
        'File too large!Please upload Maximum 8kb size image!',
        'error'
      );
    }
    reader.onload = this._handleReaderLoadedForStaffUpdate.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoadedForStaffUpdate(e) {
    let reader = e.target;
    // this.imageSrc = reader.result;
    this.editableStaff.profile = reader.result;
  }
}
