import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {expressEnvironment} from '../../environments/environment.prod';
import {LoginObject} from '../model/login.model';
import {Session} from '../model/session.model';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) {
  }

  private headers = new HttpHeaders();

  login(loginObj: LoginObject): Observable<Session> {
    const bodyLogin = new HttpParams()
      .set('username', loginObj.username)
      .set('password', loginObj.password);

    this.headers
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');


   const environment = expressEnvironment;
    return this.http.post<any>(environment.apiUrl + '/api/login', bodyLogin, {
      headers: this.headers, observe: 'response'
    })
      .pipe(
        map(user => {
        return user.body;
        }),
        tap((session: Session) => {
          return session;
        })
      );
  }

  logout(token: String): Observable<HttpResponse<Object>>  {
    console.log('Token para Logout => ' + token);

    this.headers
      .set('Authorization', '' + token);

    return this.http
      .post(expressEnvironment.apiUrl + '/api/logout', {}, {headers: new HttpHeaders({
          'Authorization': '' + token
        }), observe : 'response'});
  }
}
