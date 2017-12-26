import { Component } from '@angular/core';
import { EverydaysService } from './everydays/everydays.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [EverydaysService]
})
export class AppComponent {
  constructor() { }
}
