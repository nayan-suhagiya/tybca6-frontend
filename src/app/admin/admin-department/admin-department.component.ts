import { DeptService } from './../../services/dept.service';
import { NgForm } from '@angular/forms';
import { Dept } from './../../models/Dept';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-department',
  templateUrl: './admin-department.component.html',
  styleUrls: ['../admin.css'],
})
export class AdminDepartmentComponent implements OnInit {
  dpart = 'Department';
  @ViewChild('deptForm') deptForm: NgForm;
  deptData: Dept = new Dept();
  alldept: any;
  editableDept: Dept = new Dept();

  constructor(private deptService: DeptService) {}

  ngOnInit(): void {
    this.deptService.getDepartments().subscribe(
      (res) => {
        this.alldept = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deptSubmit() {
    this.deptService.addDepartment(this.deptData).subscribe(
      (res) => {
        this.deptForm.reset();
        if (res.inserted) {
          Swal.fire('Success!', 'Department Added!', 'success');
          this.ngOnInit();
        } else {
          Swal.fire('Oops!', 'Unable to add!', 'error');
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to add!', 'error');
      }
    );
  }

  editData(singleDept: Dept) {
    this.editableDept = singleDept;
  }

  updateSubmit() {
    this.deptService.updateDepartment(this.editableDept).subscribe(
      (res) => {
        if (res.updated) {
          Swal.fire('Success!', 'Department Updated!', 'success');
          this.ngOnInit();
        } else {
          Swal.fire('Oops!', 'Unable to update!', 'error');
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to update!', 'error');
      }
    );
  }

  deleteSubmit(deptid: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your staff data also deleted which is belong from this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.deptService.deleteDepartment(deptid).subscribe(
            (res) => {
              if (res.deleted) {
                this.ngOnInit();
              } else {
                Swal.fire('Oops!', 'Unable to delete!', 'error');
              }
            },
            (err) => {
              Swal.fire('Oops!', 'Unable to delete!', 'error');
            }
          );
          return;
        } catch (error) {
          Swal.fire('Oops!', 'Unable to delete!', 'error');
        }
      }
    });
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
