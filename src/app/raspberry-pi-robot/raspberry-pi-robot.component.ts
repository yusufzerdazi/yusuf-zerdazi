import { Component, OnInit } from '@angular/core';
import { NavbarColourService } from '../_services/navbar-colour-service';

@Component({
  selector: 'app-raspberry-pi-robot',
  templateUrl: './raspberry-pi-robot.component.html',
  styleUrls: ['./raspberry-pi-robot.component.css']
})
export class RaspberryPiRobotComponent implements OnInit {

  constructor(private navbarColourService: NavbarColourService) { }

  ngOnInit() {
    this.navbarColourService.changeNavColor.next('lightgray');
  }

  ngOnDestroy() {
    this.navbarColourService.changeNavColor.next('white');
  }
}
