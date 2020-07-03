import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import {  Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { map ,catchError} from 'rxjs/operators';

import { ProcessHTTPMsgService } from './process-httpmsg.service';



@Injectable({
  providedIn: 'root'
})
export class DishService {

  baseURL = environment.baseURL;

  constructor(private http: HttpClient,private processHTTPMsgService : ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
      return this.http.get<Dish[]>(this.baseURL + 'dishes')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getDish(id :string) : Observable<Dish> {
    return this.http.get<Dish>(this.baseURL + 'dishes/'+ id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish[]>(this.baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getDishIds(): Observable<string[] | any>{
      return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id))).
      pipe(catchError(error => error))
  }

  putDish(dish: Dish): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Dish>(this.baseURL + 'dishes/' + dish.id, dish, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }

}
