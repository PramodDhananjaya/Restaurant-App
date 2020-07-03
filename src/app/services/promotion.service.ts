import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { of, Observable} from 'rxjs'
import { map, catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  baseURL = environment.baseURL;

  constructor(private http: HttpClient,private processHTTPMsg :ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(this.baseURL+'promotions')
    .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getPromotion(id: string):Observable<Promotion>{
    return this.http.get<Promotion>(this.baseURL+'promotions/'+id)
    .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(this.baseURL+ 'promotions?featured=true').pipe(map(promotions => promotions[0]))
    .pipe(catchError(this.processHTTPMsg.handleError));
  }

}
