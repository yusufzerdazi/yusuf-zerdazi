import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";
import { Medium } from './medium';
import { Everyday } from "./everyday";
import { Piece } from "./piece";
import * as $ from 'jquery';

@Component({
    selector: 'everyday',
    templateUrl: './everyday.component.html',
    styleUrls: ['./everyday.component.css']
})
export class EverydayComponent {
    display: Piece;
    audio: Piece;
    media: Piece;
    playing: boolean = false;
    @Input() everyday: Everyday;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    ngOnChanges(): void {
        for(let piece of this.everyday.pieces){
            switch(piece.theme.medium){
                case(Medium.Image):
                    this.display = piece;
                    break;
                case(Medium.Video):
                    this.display = piece;
                    this.media = piece;
                    break;
                case(Medium.Sound):
                    this.audio = piece;
                    this.media = piece;
                    break;
            }
        }
    }

    getIcon(piece: Piece): string{
        switch(piece.theme.medium){
            case(Medium.Image):
                return "fa-image";
            case(Medium.Video):
                return "fa-video";
            case(Medium.Sound):
                return "fa-music";
            default:
                return "";
        }
    }

    toggle(): void{
        if(this.playing){
            this.pause();
        } else {
            this.play();
        }
    }

    play(): void{
        var element = <HTMLMediaElement>$("#" + this.media.id).get(0);
        element.play();
        this.playing = true;
        this.selected.emit(this.media.id);
    }

    pause(): void{
        var element = <HTMLMediaElement>$("#" + this.media.id).get(0);
        element.pause();
        this.playing = false;
    }
}