import {NgModule, Optional, SkipSelf} from '@angular/core';
import {MockBackend} from '@angular/http/testing';
import {StorageService} from '../service/storage.service';
import {AuthorizatedGuard} from './guards/authorized.guard';
import {BaseRequestOptions} from '@angular/http';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    StorageService,
    AuthorizatedGuard,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: []
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
