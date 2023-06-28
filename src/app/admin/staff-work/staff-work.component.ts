import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff-work',
  templateUrl: './staff-work.component.html',
  styleUrls: ['./staff-work.component.css', '../main.css'],
})
export class StaffWorkComponent implements OnInit {
  dpart: string = 'Staff-Work';
  workdDataLength: number = 0;
  workData: any;
  constructor(private staffService: StaffService) {}

  ngOnInit(): void {}

  searchDetails(event) {
    // console.log(event.target.value);

    let date = event.target.value;

    if (date == '') {
      this.workdDataLength = 0;
      return;
    }

    this.staffService.getStaffWorkDetails(date).subscribe(
      (res: any) => {
        if (res.length != 0) {
          this.workdDataLength = res.length;
          this.workData = res;
        } else {
          this.workData = res;
          this.workdDataLength = res.length;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}