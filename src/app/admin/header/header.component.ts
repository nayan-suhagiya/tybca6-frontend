import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../admin.css'],
})
export class HeaderComponent implements OnInit {
  @Input() part = '';
  constructor() {}

  ngOnInit(): void {}
}
