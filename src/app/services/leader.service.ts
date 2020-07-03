import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS} from '../shared/leaders';
import { of , Observable } from 'rxjs';
import { DISHES } from '../shared/dishes';
import { map , catchError} from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  baseURL = environment.baseURL;

  constructor(private http: HttpClient, private processHTTPMsg : ProcessHTTPMsgService ) { }


  getLeaders():Observable<Leader[]>{
    return this.http.get<Leader[]>(this.baseURL+ 'leadership').pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedLeader() : Observable<Leader>{
    return this.http.get<Leader>(this.baseURL+'leadership?featured=true').pipe(map(leaders => leaders[0]))
    .pipe(catchError(this.processHTTPMsg.handleError));
  }
}
