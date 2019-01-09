import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faImage, faVideo, faMusic, faSpinner, faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { faLinkedin, faGithub, faSoundcloud, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { ValuesComponent } from './values/values.component';
import { ValueComponent } from './value/value.component';
import { ArduinoRobotComponent } from './arduino-robot/arduino-robot.component';
import { RaspberryPiRobotComponent } from './raspberry-pi-robot/raspberry-pi-robot.component';
import { NavbarColourService } from './_services/navbar-colour-service';

library.add(faImage, faVideo, faMusic, faSpinner, faChevronDown, faLinkedin, faGithub, faSoundcloud, faTwitter, faFacebook);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ValuesComponent,
    ValueComponent,
    ArduinoRobotComponent,
    RaspberryPiRobotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'values', component: ValuesComponent },
      { path: 'arduino-robot', component: ArduinoRobotComponent },
      { path: 'raspberry-pi-robot', component: RaspberryPiRobotComponent }
    ]),
    FontAwesomeModule
  ],
  providers: [NavbarColourService],
  bootstrap: [AppComponent]
})
export class AppModule { }
