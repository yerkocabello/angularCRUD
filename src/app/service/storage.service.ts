import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Session} from '../model/session.model';
import {User} from '../model/user.model';
import {LoginObject} from '../model/login.model';


@Injectable()
export class StorageService {
  private localStorageService;
  private currentSession: Session = null;

  constructor(private router: Router) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  setRememberMe(login: LoginObject): void {
    console.log('recibe datos: ' + login.password + login.username);
    this.localStorageService.setItem('rememberUser.username', login.username);
    this.localStorageService.setItem('rememberUser.password', login.password);
    this.localStorageService.setItem('rememberUser.remember', login.password);
  }

  getRememberMe(): LoginObject {
    if (this.localStorageService.getItem('rememberUser.username') !== 'undefined') {
      return new LoginObject({
        'username': this.localStorageService.getItem('rememberUser.username'),
        'password': this.localStorageService.getItem('rememberUser.password'),
        'rememberMe': this.localStorageService.getItem('rememberUser.remember')
      });
    } else {
      return null;
    }
  }

  removeRememberMe(): void {
    this.localStorageService.removeItem('rememberUser.username');
    this.localStorageService.removeItem('rememberUser.password');
    this.localStorageService.removeItem('rememberUser.remember');
  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }

  loadSessionData(): Session {
    if (this.localStorageService.getItem('currentUser') !== 'undefined') {
      const sessionStr = this.localStorageService.getItem('currentUser');
      return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
    } else {
      return null;
    }
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  // TODO: 3it -> Get Username from token
  getCurrentUser(): User {
    const session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  }

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null);
  }

  getCurrentToken(): string {
    const session = this.getCurrentSession();
    return (session && session.access_token) ? session.access_token : null;
  }

  logout(): void {
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }
}
