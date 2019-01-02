import { Component } from '@angular/core';

declare var particlesJS: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor() {
  }
  ngOnInit() {
    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS.load('header_wave', './assets/particles/particlesjs-config.json', function () {
      //console.log('callback - particles.js config loaded');
    });
  }
}