import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() img: string;
  overlay: boolean;

  constructor() { }

  ngOnInit() {
  }

}
