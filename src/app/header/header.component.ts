import { Component } from '@angular/core';
import { headerFooterParticles } from '../_config/particlesjs-config';
import { NavbarColourService } from '../_services/navbar-colour-service';

declare var particlesJS: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navColor: string;
  constructor(private navbarColourService: NavbarColourService) {
  }
  ngOnInit() {
    this.navbarColourService.changeNavColor.subscribe((color) => {
      this.navColor = color;
    })

    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS('header_wave', headerFooterParticles, function () {
      //console.log('callback - particles.js config loaded');
    });
  }
}