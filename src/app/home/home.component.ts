import { Component } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  headerImage: string;
  constructor() {
  }
  ngOnInit() {
    this.headerImage = "yusuf.svg";
  }
}