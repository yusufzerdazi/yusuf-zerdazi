import { Component, Input, Output, OnChanges, EventEmitter, Inject } from "@angular/core";
import { EverydaysService } from './everydays.service';
import { Medium } from './medium';
import { Everyday } from "./everyday";
import { Piece } from "./piece";
import * as $ from 'jquery';
import {VgAPI} from 'videogular2/core';
import {Visualiser} from '../../assets/visualiser/visualiser';

@Component({
    selector: 'everyday',
    templateUrl: './everyday.component.html',
    styleUrls: ['./everyday.component.css']
})
export class EverydayComponent {
    visualiser:Visualiser;
    display: Piece;
    audio: Piece;
    media: Piece;
    sources: Piece[];
    api: VgAPI;
    playing: boolean = false;
    thumbnail: string;
    bgColor:string = getRandomColor();
    optionsVisible:boolean = false;
    @Input() everyday: Everyday;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    constructor(private _everydaysService: EverydaysService){

    }

    onPlayerReady(api:VgAPI) {
        this.api = api
        this.api.fsAPI.nativeFullscreen = false;
        this.api.fsAPI.onChangeFullscreen.subscribe(
            event => {
                if(this.display.theme.medium == 0){
                    if(this.media && event){
                        this.selected.emit(this.media.id)
                        if(this.display.explicit){
                            this.api.getDefaultMedia().elem.setAttribute("poster", "./assets/images/explicit_large.jpg");
                        } else {
                            this.api.getDefaultMedia().elem.setAttribute("poster", this.display.url + "?width=2000&height=2000&cropmode=none");
                        }
                    } else if(this.media) {
                        if(this.display.explicit){
                            this.api.getDefaultMedia().elem.setAttribute("poster", "./assets/images/explicit.jpg");
                        } else {
                            this.api.getDefaultMedia().elem.setAttribute("poster", this.display.url + "?width=275&height=275&cropmode=center");
                        }
                    }
                }
            }
        );

        this.api.subscriptions.play.subscribe(
            event => {
                
                if(!this.display){
                    if(this.visualiser){
                        this.visualiser.play();
                    } else {
                        this.visualiser = new Visualiser(this.media.id);
                    }
                }
                this.selected.emit(this.media.id)
            }
        )

        this.api.subscriptions.pause.subscribe(
            event => {
                if(!this.display){
                    this.visualiser.stop();
                }
            }
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
                    this.sources = [this.media];
                    break;
                case(Medium.Sound):
                    this.audio = piece;
                    this.media = piece;
                    this.sources = [this.media];
                    break;
            }
        }
        if(this.display){
            switch(this.display.theme.medium){
                case(Medium.Image):
                    if(this.display.explicit){
                        this.thumbnail = "./assets/images/explicit.jpg";
                    } else {
                        this.thumbnail = this.display.url + "?width=275&height=275&cropmode=center";
                    }
                    break;
                case(Medium.Video):
                    this.thumbnail = this.display.url.replace('/root/content', '/driveItem/thumbnails/0/large/content');
                    break;
                default:
                    this.thumbnail = '';
                    break;
            }
        }
    }

    getIcon(piece: Piece): string{
        switch(piece.theme.medium){
            case(Medium.Image):
                return "image";
            case(Medium.Video):
                return "video";
            case(Medium.Sound):
                return "music";
            default:
                return "";
        }
    }

    pause(): void{
        this.api.pause();
    }

    toggle(): void {
        if(this.media && !this.media.explicit){
            this.api.state == "playing" ? this.api.pause() : this.api.play();
        }
    }

    openSource(piece: Piece): void {
        if(piece.explicit){
            this._everydaysService.getPiece(piece.id).subscribe(
                p => {
                    if(this.media.id == piece.id){
                        this.media.url = p.url;
                        this.media.explicit = false;
                        this.everyday.pieces = [p,this.display];
                        this.sources = [this.media];
                        console.log(this.media);
                    }
                    if(this.display.id == piece.id){
                        this.display.url = p.url;
                        this.display.explicit = false;
                        this.thumbnail = this.display.url + "?width=275&height=275&cropmode=center";
                        this.everyday.pieces = [this.media,p];
                    }
                });
        }
        else if(piece.source && piece.source.url){
            window.open(piece.source.url, "_blank");
        }
    }

    showOptions(){
        this.optionsVisible = true;
    }

    hideOptions(){
        this.optionsVisible = false;
    }
}

function getRandomColor(){
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}