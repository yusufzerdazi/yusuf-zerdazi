import { Component, Input, Output, EventEmitter, OnChanges, ViewChildren } from '@angular/core';
import { Month } from './month';
import { EverydayComponent } from './everyday.component';

@Component({
    selector: 'month',
    templateUrl: './month.component.html',
    styleUrls: ['./month.component.css']
})
export class MonthComponent {
    @Input() month: Month;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    @ViewChildren(EverydayComponent) children;
    title: string;
    date: string;
    isVideo: boolean;
    monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    monthStyles: object;

    ngOnChanges(): void {
        var monthDate = new Date(this.month.start);
        this.title = this.month.themes.map(t => t.title).join(" and ");
        this.date = this.monthNames[monthDate.getMonth()] + " " + monthDate.getFullYear().toString();
        this.isVideo = this.month.themes.map(x => x.medium).includes(2);

        this.monthStyles = {
            // 'background' : 'linear-gradient(\
            //     rgba(255, 255, 255, 0.5),\
            //     rgba(255, 255, 255, 0.5)\
            //   ), url('+ this.month.imageUrl +')',
            'background': monthDate.getMonth() % 2 == 0 ? "#fafafa" : "white",
            'background-attachment': 'fixed',
            'background-position': 'center top',
            'background-repeat' : 'no-repeat',
            'background-size': '1920px'
        }
    }
}