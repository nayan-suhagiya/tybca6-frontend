import { DeptService } from './../../services/dept.service';
import { NgForm } from '@angular/forms';
import { Dept } from './../../models/Dept';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-department',
  templateUrl: './admin-department.component.html',
  styleUrls: ['../admin.css'],
})
export class AdminDepartmentComponent implements OnInit {
  @ViewChild('deptForm') deptForm: NgForm;
  deptData: Dept = new Dept();
  alldept: any;
  editableDept: Dept = new Dept();

  constructor(private deptService: DeptService) {}

  ngOnInit(): void {
    this.deptService.getDepartments().subscribe(
      (res) => {
        // console.log(res);
        this.alldept = res;
        // console.log(this.alldept.length);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deptSubmit() {
    this.deptService.addDepartment(this.deptData).subscribe(
      (res) => {
        // console.log(res);
        this.deptForm.reset();
        if (res.inserted) {
          alert('Added!');
          this.ngOnInit();
        } else {
          throw new Error('Unable to insert');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editData(singleDept: Dept) {
    // console.log(singleDept);
    this.editableDept = singleDept;
    // console.log(this.editableDept);
  }

  updateSubmit() {
    // console.log(this.deptData);
    this.deptService.updateDepartment(this.editableDept).subscribe(
      (res) => {
        // console.log(res);
        if (res.updated) {
          alert('Updated!');
          this.ngOnInit();
        } else {
          throw new Error('Unable to update');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteSubmit(deptid: string) {
    const conf = confirm(
      'your staff data also deleted which is belong from this department!'
    );
    if (conf == true) {
      try {
        this.deptService.deleteDepartment(deptid).subscribe(
          (res) => {
            // console.log(res);
            if (res.deleted) {
              // alert('deleted');
              this.ngOnInit();
            } else {
              throw new Error('Unable to delete');
            }
          },
          (err) => {
            console.log(err);
          }
        );
        return;
      } catch (error) {
        alert('connot deleted!');
      }
    }
  }

  generateRandomDeptID() {
    this.deptData.deptid = 'D' + Math.floor(1000 + Math.random() * 9000);
  }

  callNgOn() {
    this.ngOnInit();
  }

  resetForm() {
    this.deptForm.reset();
  }
}
