import { Component } from '@angular/core';
import { headerFooterParticles } from '../_config/particlesjs-config';

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
    particlesJS('footer', headerFooterParticles, function () {
      //console.log('callback - particles.js config loaded');
    });
  }
}