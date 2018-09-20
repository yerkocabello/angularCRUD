import {BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {routing} from './app.routing';
import {AuthenticationService} from './service/auth.service';
import {UserService} from './service/user.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import {AuthInterceptor} from './core/interceptor/auth.interceptor';
import {Data} from './providers/data';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {CoreModule} from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CustomMaterialModule} from './material.module';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddUserComponent,
    EditUserComponent,
    ListUserComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    routing,
    ReactiveFormsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    BrowserAnimationsModule,
    CustomMaterialModule
  ],
  providers: [AuthenticationService, UserService, Title
    // TODO: 3it -> Enabled Interceptor -> header: Authorization
    ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    Data
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
