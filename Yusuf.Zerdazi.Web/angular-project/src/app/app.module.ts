import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material';
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
import { EverydayModalComponent } from './everydays/everyday.modal.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    EverydaysComponent,
    MonthComponent,
    EverydayComponent,
    EverydayModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatTooltipModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgbTooltipModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: 'everydays', component: EverydaysComponent },
      { path: '', component: HomeComponent, pathMatch: 'full'}
    ], {useHash: true})
  ],
  entryComponents: [EverydayModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
