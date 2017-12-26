import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Month } from './month';
import { HttpErrorResponse } from '@angular/common/http/src/response';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class EverydaysService {
    private _everydaysUrl = '/api/everydays';

    constructor(private _http: HttpClient){}

    getEverydays(): Observable<Month[]> {
        return this._http.get<Month[]>(this._everydaysUrl)
                    .catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse){
        console.log(err.message);
        return Observable.throw(err.message);
    }
}