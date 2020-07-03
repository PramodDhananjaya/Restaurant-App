import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { catchError} from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseURL = environment.baseURL;

  constructor(private http: HttpClient, private processHTTPMsg: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback>{
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    };
    console.log(feedback);
    return this.http.post<Feedback>(this.baseURL + 'feedback/', feedback,httpOptions)
    .pipe(catchError(this.processHTTPMsg.handleError));
  }
}

