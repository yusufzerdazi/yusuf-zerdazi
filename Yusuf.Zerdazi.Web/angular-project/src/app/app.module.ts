// Angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Npm modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faImage, faVideo, faMusic, faSpinner, faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { faLinkedin, faGithub, faSoundcloud, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

library.add(faImage, faVideo, faMusic, faSpinner, faChevronDown, faLinkedin, faGithub, faSoundcloud, faTwitter, faFacebook);

// Custom components
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header.component';
import { FooterComponent } from './shared/footer.component';
import { EverydaysComponent } from './everydays/everydays.component';
import { HomeComponent } from './home/home.component';
import { MonthComponent } from './everydays/month.component';
import { EverydayComponent } from './everydays/everyday.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    EverydaysComponent,
    MonthComponent,
    EverydayComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbTooltipModule,
    InfiniteScrollModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    FontAwesomeModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: 'everydays', component: EverydaysComponent },
      { path: '', component: HomeComponent, pathMatch: 'full'}
    ], {useHash: true, initialNavigation: 'enabled' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
