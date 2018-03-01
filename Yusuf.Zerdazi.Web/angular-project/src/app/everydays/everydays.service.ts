import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Month } from './month';
import { Piece } from './piece';
import { HttpErrorResponse } from '@angular/common/http/src/response';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class EverydaysService {
    private _everydaysUrl = '/api/everydays';
    private _monthUrl = '/api/everydays/month/';
    private _pieceUrl = '/api/everydays/piece/';

    constructor(private _http: HttpClient){}

    getPiece(id: number): Observable<Piece> {
        return this._http.get<Piece>(this._pieceUrl+id+"?showExplicit=true")
                    .catch(this.handleError);
    }

    getEverydays(): Observable<Month[]> {
        return this._http.get<Month[]>(this._everydaysUrl)
                    .catch(this.handleError);
    }

    getMonth(month: number): Observable<Month> {
        return this._http.get<Month>(this._monthUrl + month.toString())
                    .catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse){
        console.log(err.message);
        return Observable.throw(err.message);
    }
}