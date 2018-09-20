import {
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor, HttpProgressEvent,
  HttpRequest, HttpResponse,
  HttpSentEvent, HttpUserEvent
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StorageService} from '../../service/storage.service';
import {AuthService} from '../../service/AuthService';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, filter, finalize, switchMap, take, tap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private storageService: StorageService,
    private authService: AuthService) {
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    if (req.url.indexOf('/accounts/password') <= 0 && req.url.indexOf('/login') <= 0) {
      return req.clone({ setHeaders: { Authorization:  token }});
    } else {
      return req;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    return next.handle(this.addToken(req, this.authService.getAuthToken()))
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {

            console.log('all looks good');
            // http response status code
            console.log(event.status);
          }
        }, error => {
          error.code === 401 ?
             this.handle401Error(req, next) : throwError(error.message);
        })
      );
  }


  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.refreshToken()
        .pipe(switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            return next.handle(this.addToken((req), newToken));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        }), catchError(err => {
              return this.logoutUser();
          }),
    finalize(() => {
        this.isRefreshingToken = false;
      }));
    } else {
      return this.tokenSubject
        .pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken((req), token));
        }));
    }
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    this.storageService.logout();
    return throwError('');
  }


}
