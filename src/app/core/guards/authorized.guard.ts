import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {StorageService} from '../../service/storage.service';

@Injectable()
export class AuthorizatedGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {
  }

  canActivate() {
    if (this.storageService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
