import { Component } from '@angular/core';
import { headerFooterParticles } from '../_config/particlesjs-config';

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
    particlesJS('header_wave', headerFooterParticles, function () {
      //console.log('callback - particles.js config loaded');
    });
  }
}