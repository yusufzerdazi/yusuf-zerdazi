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

library.add(faImage, faVideo, faMusic, faSpinner, faChevronDown, faLinkedin, faGithub, faSoundcloud, faTwitter, faFacebook);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ValuesComponent,
    ValueComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'values', component: ValuesComponent }
    ]),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
