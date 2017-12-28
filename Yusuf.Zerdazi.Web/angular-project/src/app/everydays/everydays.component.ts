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
    finishedLoading: boolean = false;
    months: Month[] = new Array<Month>();
    playing: number;
    loading: boolean = true;
    @ViewChildren(MonthComponent) children;

    constructor(private _everydaysService: EverydaysService){

    }

    ngOnInit(): void {
        this._everydaysService.getMonth(this.months.length)
            .subscribe(
                month => {
                    this.months.push(month);
                    this.loading = false;
                },
            error => this.errorMessage = <any>error
        );
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

    onScroll () {
        if(!this.finishedLoading && !this.loading){
            this.loading = true;
            this._everydaysService.getMonth(this.months.length)
                .subscribe(
                    month => {
                        this.loading = false;
                        this.months.push(month);
                    },
                error => {
                    this.errorMessage = <any>error;
                    this.finishedLoading = true;
                    this.loading = false;
                } 
            );
        }
    }
}