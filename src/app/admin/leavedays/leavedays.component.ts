import Swal from 'sweetalert2';
import { StaffService } from './../../services/staff.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Leave } from './Leave';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as moment from 'moment';

@Component({
  selector: 'app-leavedays',
  templateUrl: './leavedays.component.html',
  styleUrls: ['./leavedays.component.css', '../admin.css'],
})
export class LeavedaysComponent implements OnInit {
  @ViewChild('addLeaveForm') addLeaveForm: NgForm;
  addLeaveData: Leave = new Leave();
  calendarOptions: CalendarOptions;
  events: any = [];

  dpart: string = 'Add Leave Days';
  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [],
    };

    this.events = [];
    this.staffService.getAllLeave().subscribe(
      (res) => {
        // console.log(res);
        if (res.length == 0) {
        } else {
          res = res.filter((data) => {
            return (data.leavedate = moment(data.leavedate).format(
              'YYYY-MM-DD'
            ));
          });

          // console.log(res);

          // console.log(res);
          for (let i = 0; i < res.length; i++) {
            this.events.push({
              title: 'O',
              date: res[i].leavedate,
              color: '#6c757d',
            });
          }
          this.calendarOptions.events = this.events;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  leaveFormSubmit() {
    // console.log(this.addLeaveData);
    this.staffService.addLeave(this.addLeaveData).subscribe(
      (res) => {
        // console.log(res);
        if (res.added) {
          Swal.fire('Success!', 'Added!', 'success');
          this.ngOnInit();
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.addLeaveForm.reset();
  }

  removeLeave() {
    this.staffService.removeLeave(this.addLeaveData.date).subscribe(
      (res) => {
        // console.log(res);
        if (res.deleted) {
          this.ngOnInit();
          Swal.fire('Success!', 'Deleted!', 'success');
        } else {
          Swal.fire('Warning!', 'There is no off day!', 'warning');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
