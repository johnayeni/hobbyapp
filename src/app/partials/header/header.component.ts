import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isActive: Boolean = false;

  toggleNav(): void {
    this.isActive ? this.isActive = false : this.isActive = true;
  }

  constructor() { }

  ngOnInit() {
  }

}
