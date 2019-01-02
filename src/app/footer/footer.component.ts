import { Component } from '@angular/core';

declare var particlesJS: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor() {
  }
  ngOnInit() {
    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS.load('footer', '../../assets/particles/particlesjs-config.json', function () {
      //console.log('callback - particles.js config loaded');
    });
  }
}