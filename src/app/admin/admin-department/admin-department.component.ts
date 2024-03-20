import { NgxSpinnerService } from 'ngx-spinner';
import { DeptService } from './../../services/dept.service';
import { NgForm } from '@angular/forms';
import { Dept } from './../../models/Dept';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-department',
  templateUrl: './admin-department.component.html',
  styleUrls: ['../main.css'],
})
export class AdminDepartmentComponent implements OnInit {
  dpart = 'Department';
  @ViewChild('deptForm') deptForm: NgForm;
  deptData: Dept = new Dept();
  alldept: any;
  editableDept: Dept = new Dept();

  constructor(private deptService: DeptService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.spinner.show();
    this.deptService.getDepartments().subscribe(
      (res) => {
        this.alldept = res;
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  deptSubmit() {
    this.spinner.show();
    this.deptService.addDepartment(this.deptData).subscribe(
      (res) => {
        this.deptForm.reset();
        if (res.inserted) {
          Swal.fire('Success!', 'Department Added!', 'success');
          this.loadDepartments();
        } else {
          Swal.fire('Oops!', 'Unable to add!', 'error');
        }
        this.spinner.hide();
      },
      (err) => {
        // console.log(err);
        if(err.status === 409){
          Swal.fire("Oops!","Department name already exists!","error")
        }else{
          Swal.fire('Oops!', 'Unable to add!', 'error');
        }
        this.spinner.hide();
      }
    );
  }

  editData(singleDept: Dept) {
    this.editableDept = singleDept;
  }

  updateSubmit() {
    this.spinner.show();
    this.deptService.updateDepartment(this.editableDept).subscribe(
      (res) => {
        if (res.updated) {
          Swal.fire('Success!', 'Department Updated!', 'success');
          this.loadDepartments();
        } else {
          Swal.fire('Oops!', 'Unable to update!', 'error');
        }
        this.spinner.hide();
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to update!', 'error');
        this.spinner.hide();
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
          this.spinner.show();
          this.deptService.deleteDepartment(deptid).subscribe(
            (res) => {
              if (res.deleted) {
                this.loadDepartments();
              } else {
                Swal.fire('Oops!', 'Unable to delete!', 'error');
              }
              this.spinner.hide();
            },
            (err) => {
              Swal.fire('Oops!', 'Unable to delete!', 'error');
              this.spinner.hide();
            }
          );
          return;
        } catch (error) {
          Swal.fire('Oops!', 'Unable to delete!', 'error');
          this.spinner.hide();
        }
      }
    });
  }

  generateRandomDeptID() {
    this.deptData.deptid = 'D' + Math.floor(1000 + Math.random() * 9000);
  }

  callNgOn() {
    this.loadDepartments();
  }

  resetForm() {
    this.deptForm.reset();
  }
}
