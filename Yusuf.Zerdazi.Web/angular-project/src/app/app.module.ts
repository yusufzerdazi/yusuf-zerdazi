import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './shared/header.component';
import { FooterComponent } from './shared/footer.component';

import { EverydaysComponent } from './everydays/everydays.component';
import { HomeComponent } from './home/home.component';
import { MonthComponent } from './everydays/month.component';
import { EverydayComponent } from './everydays/everyday.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

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
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbTooltipModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: 'everydays', component: EverydaysComponent },
      { path: '', component: HomeComponent, pathMatch: 'full'}
    ], {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
