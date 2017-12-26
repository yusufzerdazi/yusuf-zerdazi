import { Component, OnInit, Output, EventEmitter, ViewChildren } from '@angular/core';
import { EverydaysService } from './everydays.service';
import { Month } from './month';
import { MonthComponent } from './month.component';
import * as $ from 'jquery';

@Component({
    templateUrl: './everydays.component.html',
    styleUrls: ['./everydays.component.css']
  })
export class EverydaysComponent{
    errorMessage: string;
    months: Month[];
    playing: number;
    @ViewChildren(MonthComponent) children;

    constructor(private _everydaysService: EverydaysService){

    }

    ngOnInit(): void {
        this._everydaysService.getEverydays()
            .subscribe(months => this.months = months,
                       error => this.errorMessage = <any>error);
    }

    onSelected(id: number){
        for(var month of this.children._results){
            for(var everyday of month.children._results){
                if(everyday.media.id != id){
                    everyday.pause();
                }
            }
        }
    }
}