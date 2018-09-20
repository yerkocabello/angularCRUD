import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/auth.service';
import {LoginObject} from '../model/login.model';
import {Session} from '../model/session.model';
import { UserIdleService } from 'angular-user-idle';
import {Keepalive} from '@ng-idle/keepalive';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {StorageService} from '../service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  invalidLogin = false;
  private obj: LoginObject;
  public showError = false;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService, private idle: Idle,
              private userIdle: UserIdleService, private keepalive: Keepalive, private storageService: StorageService) { }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    if (this.loginForm.valid) {
      this.obj = new LoginObject(this.loginForm.value);
      this.authService
        .login(this.obj)
        .subscribe(
          data => this.correctLogin(data)
        );
    } else {
      this.invalidLogin = true;
    }
  }

  private correctLogin(data: Session) {

    if (data.failed) {
      this.showError = true;
    } else {
      this.setTimeoutSession();

      this.storageService.setCurrentSession(data);

      if (this.obj.rememberMe) {
        this.storageService.setRememberMe(new LoginObject(this.loginForm.value));
      } else {
        this.storageService.removeRememberMe();
      }
      this.router.navigate(['list-user']);
    }


  }

  private setTimeoutSession() {
    // sets an idle timeout of 1 second, for testing purposes.
    this.idle.setIdle(1);
    // sets a timeout period of 5 seconds. after 1 hour (3600 seconds) of inactivity, the user will be considered timed out.
    this.idle.setTimeout(3600);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.storageService.logout();
    });
    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  private setLoginform() {
    this.loginForm = this.formBuilder.group({
      username: [
        this.storageService.getRememberMe().username !== null ? this.storageService.getRememberMe().username.toString() : '',
        Validators.required],
      password: [
        this.storageService.getRememberMe().password !== null ? this.storageService.getRememberMe().password.toString() : '',
        Validators.required],
      remember: [this.storageService.getRememberMe().rememberMe !== null ? this.storageService.getRememberMe().rememberMe : false]
    });
  }

  ngOnInit() {
    this.setLoginform();
  }



}
