import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Assuming this would be cached somehow from a login call.
  public authTokenStale = 'stale_auth_token';
  public authTokenNew = 'new_auth_token';
  public currentToken: string;
  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.currentToken = this.authTokenStale;
    this.storageService = storageService;
  }

  getAuthToken() {
    return this.storageService.getCurrentToken();
  }

  refreshToken(): Observable<string> {
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */

    this.currentToken = this.authTokenNew;

    return Observable.create(this.authTokenNew).pipe(delay(200));
  }
}
