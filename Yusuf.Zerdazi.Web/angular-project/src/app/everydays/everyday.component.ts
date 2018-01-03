import { Component, Input, Output, OnChanges, EventEmitter, Inject } from "@angular/core";
import { Medium } from './medium';
import { Everyday } from "./everyday";
import { Piece } from "./piece";
import * as $ from 'jquery';
import {VgAPI} from 'videogular2/core';

@Component({
    selector: 'everyday',
    templateUrl: './everyday.component.html',
    styleUrls: ['./everyday.component.css']
})
export class EverydayComponent {
    display: Piece;
    audio: Piece;
    media: Piece;
    api: VgAPI;
    playing: boolean = false;
    thumbnail: string;
    @Input() everyday: Everyday;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    onPlayerReady(api:VgAPI) {
        this.api = api
        this.api.fsAPI.nativeFullscreen = false;
        this.api.fsAPI.onChangeFullscreen.subscribe(
            event => {
                if(this.display.theme.medium == 0){
                    if(event){
                        this.selected.emit(this.media.id)
                        this.api.getDefaultMedia().elem.setAttribute("poster", this.display.url + "?width=2000&height=2000&cropmode=none");
                    } else {
                        this.api.getDefaultMedia().elem.setAttribute("poster", this.display.url + "?width=275&height=275&cropmode=center")
                    }
                }
            }
        );

        this.api.subscriptions.play.subscribe(
            event => this.selected.emit(this.media.id)
        )
    }
    
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

        switch(this.display.theme.medium){
            case(Medium.Image):
                this.thumbnail = this.display.url + "?width=275&height=275&cropmode=center";
                break;
            case(Medium.Video):
                this.thumbnail = this.display.url.replace('/root/content', '/driveItem/thumbnails/0/large/content');
                break;
            default:
                this.thumbnail = '';
                break;
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

    pause(): void{
        this.api.getDefaultMedia().pause();
    }

    openSource(piece: Piece): void {
        if(piece.source && piece.source.url){
            window.open(piece.source.url, "_blank");
        }
    }
}

