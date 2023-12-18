import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeptService } from 'src/app/services/dept.service';
import { StaffService } from 'src/app/services/staff.service';
import { Salary } from './Salary';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-salary',
  templateUrl: './admin-salary.component.html',
  styleUrls: ['./admin-salary.component.css', '../main.css'],
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
  today: string;

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

    this.staffService.getSalary().subscribe(
      (res) => {
        // console.log(res);
        if (res.length != 0) {
          this.allSalaryData = res;
          this.allSalaryDataLength = res.length;
        } else {
          this.allSalaryDataLength = 0;
          this.allSalaryData = [];
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
    this.salaryData.salarydate = new Date().toISOString().split('T')[0];
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
    // this.spinner.show();
    this.salaryData.empid = this.staff[0].empid;
    this.salaryData.fname = this.staff[0].fname;
    this.salaryData.month = new Date().getMonth() + 1;
    this.salaryData.year = new Date().getFullYear();
    // console.log(this.allSalaryData.length);
    // console.log(this.salaryData);

    if (this.allSalaryData.length !== 0) {
      const userSalaryData = this.allSalaryData.filter((data) => {
        return this.salaryData.empid == data.empid;
      });

      // console.log(userSalaryData);
      if (userSalaryData.length != 0) {
        console.log(userSalaryData);
        const specificSalaryData = userSalaryData.filter((data) => {
          return (
            this.salaryData.month == data.month &&
            this.salaryData.year == data.year
          );
        });

        // console.log(specificSalaryData);
        if (specificSalaryData.length !== 0) {
          this.spinner.hide();
          Swal.fire(
            'Warning!',
            'Salary already paid for this month!',
            'warning'
          );
          return;
        } else {
          /*
          const date = String(this.salaryData.salarydate);
          const dateArr = date.split('-');
          const addSalaryMonth = Number(dateArr[1]);

          // console.log(addSalaryMonth);

          const currentMonth = new Date().getMonth() + 1;

          // console.log(currentMonth);

          if (addSalaryMonth == currentMonth) {
            this.spinner.hide();
            Swal.fire(
              'Warning!',
              'Salary already paid for this month!',
              'warning'
            );
            return;
          }
          */
          // console.log('Else part!');

          // console.log(this.salaryData);
          const salarydate = this.salaryData.salarydate;

          this.staffService.addSalary(this.salaryData).subscribe(
            (res) => {
              if (res.inserted) {
                this.spinner.hide();

                Swal.fire('Success!', 'Salary Added Successfully!', 'success');

                // console.log(this.salaryData);

                this.staffService
                  .sendMail({
                    empid: this.staff[0].empid,
                    salarydate: salarydate,
                    email: this.staff[0].email,
                    fname: this.staff[0].fname,
                  })
                  .subscribe(
                    (res) => {
                      console.log(res);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );

                this.ngOnInit();
                return;
              }
            },
            (err) => {
              console.log(err);
              this.spinner.hide();

              Swal.fire('Error!', 'Unable to add salary!', 'error');
              return;
            }
          );
          this.ngOnInit();
        }
      } else {
        this.staffService.addSalary(this.salaryData).subscribe(
          (res) => {
            this.spinner.hide();
            // console.log(res);
            if (res.inserted) {
              this.spinner.hide();

              Swal.fire('Success!', 'Salary Added Successfully!', 'success');

              // console.log(this.staff);
              this.staffService
                .sendMail({
                  empid: this.salaryData.empid,
                  salarydate: this.salaryData.salarydate,
                  email: this.staff[0].email,
                  fname: this.staff[0].fname,
                })
                .subscribe(
                  (res) => {
                    // console.log(res);
                  },
                  (err) => {
                    console.log(err);
                  }
                );

              this.ngOnInit();
              return;
            }
          },
          (err) => {
            console.log(err);
            this.spinner.hide();

            Swal.fire('Error!', 'Unable to add salary!', 'error');
          }
        );
      }
    } else {
      // console.log('else part');

      const salarydate = this.salaryData.salarydate;
      this.staffService.addSalary(this.salaryData).subscribe(
        (res) => {
          if (res.inserted) {
            this.spinner.hide();
            Swal.fire('Success!', 'Salary Added Successfully!', 'success');
            // console.log(this.salaryData);
            this.staffService
              .sendMail({
                empid: this.staff[0].empid,
                salarydate: salarydate,
                email: this.staff[0].email,
                fname: this.staff[0].fname,
              })
              .subscribe(
                (res) => {
                  console.log(res);
                },
                (err) => {
                  console.log(err);
                }
              );
            this.ngOnInit();
            return;
          }
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
          Swal.fire('Error!', 'Unable to add salary!', 'error');
          return;
        }
      );
      this.ngOnInit();
    }

    // console.log(this.salaryData);
  }

  deleteSalary(data: any) {
    // console.log(data);
    this.staffService.deleteSalary(data).subscribe(
      (res) => {
        console.log(res);

        if (res.deleted) {
          Swal.fire('Success!', 'Salary deleted successfully!', 'success');
          this.ngOnInit();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
