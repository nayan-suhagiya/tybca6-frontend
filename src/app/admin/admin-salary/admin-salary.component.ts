import { Component, OnInit, ViewChild } from '@angular/core';
import { DeptService } from 'src/app/services/dept.service';
import { StaffService } from 'src/app/services/staff.service';
import { Salary } from './Salary';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-salary',
  templateUrl: './admin-salary.component.html',
  styleUrls: ['./admin-salary.component.css', '../admin.css'],
})
export class AdminSalaryComponent implements OnInit {
  @ViewChild('salaryForm') salaryForm: NgForm;
  dpart: string = 'Salary';
  staffData: any;
  staffName: any[] = [];
  staff: any;
  staffNameLength: number;
  allDeptData: any;
  allDeptName: string[] = [];
  showSalaryTable: boolean = false;
  salaryData: Salary = new Salary();
  allSalaryData: any;
  allSalaryDataLength: number;

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

    this.staffService.getSalary().subscribe(
      (res) => {
        // console.log(res);
        if (res.length != 0) {
          this.allSalaryData = res;
          this.allSalaryDataLength = res.length;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffNameLength = 0;
    this.staffName = [];
    this.showSalaryTable = false;
    this.salaryData = new Salary();
  }

  getStaffData(event) {
    this.staffName = [];
    this.showSalaryTable = false;
    this.staffNameLength = 0;
    // console.log(event.target.value);

    if (event.target.value == '') {
      this.staffName = [];
      this.showSalaryTable = false;
      this.staffNameLength = 0;
      return;
    }

    this.staffService.getStaffUsingDname(event.target.value).subscribe(
      (res) => {
        // console.log(res);

        if (res.length != 0) {
          this.staffData = res;
          this.staffNameLength = res.length;
          for (let staff of res) {
            // console.log(staff);
            this.staffName.push(staff.fname);
          }
        } else {
          this.showSalaryTable = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  filterStaff(event) {
    // console.log(event.target.value);
    // console.log(this.staffData);
    if (event.target.value == '') {
      this.showSalaryTable = false;
      return;
    }

    this.staff = this.staffData.filter((data) => {
      return data.fname == event.target.value;
    });

    // console.log(this.staff);
    this.showSalaryTable = true;
  }

  calculateSalary(event) {
    const basicSalary = Number(event.target.value);

    this.salaryData.basicSalary = basicSalary;
    this.salaryData.hra = (basicSalary * 22) / 100;
    this.salaryData.medicalAllow = (basicSalary * 8) / 100;
    this.salaryData.dearnessAllow = (basicSalary * 6.5) / 100;
    this.salaryData.grossSal =
      basicSalary +
      this.salaryData.hra +
      this.salaryData.medicalAllow +
      this.salaryData.dearnessAllow;
    this.salaryData.epf = (basicSalary * 9) / 100;
    this.salaryData.healthInsurance = (basicSalary * 3) / 100;
    this.salaryData.tax = (basicSalary * 5) / 100;
    this.salaryData.deduction =
      this.salaryData.epf +
      this.salaryData.healthInsurance +
      this.salaryData.tax;
    this.salaryData.netPay =
      this.salaryData.grossSal - this.salaryData.deduction;
  }

  salaryFormSubmit() {
    this.salaryData.empid = this.staff[0].empid;
    const specificSalaryData = this.allSalaryData.filter((data) => {
      return this.salaryData.empid == data.empid;
    });

    // console.log(specificSalaryData.length);
    if (specificSalaryData.length != 0) {
      const date = String(this.salaryData.salarydate);
      const dateArr = date.split('-');
      const addSalaryMonth = Number(dateArr[1]);

      const currentMonth = new Date().getMonth() + 1;

      if (addSalaryMonth == currentMonth) {
        Swal.fire('Warning!', 'Salary already paid for this month!', 'warning');
        return;
      }
    }

    // console.log(this.salaryData);

    this.staffService.addSalary(this.salaryData).subscribe(
      (res) => {
        // console.log(res);
        if (res.inserted) {
          Swal.fire('Success!', 'Salary Added Successfully!', 'success');
          return;
        }
      },
      (err) => {
        console.log(err);
        Swal.fire('Error!', 'Unable to add salary!', 'error');
      }
    );
    this.ngOnInit();
  }
}
