import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {User} from '../model/user.model';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  users: User[];
  displayedColumns: string[] = ['id', 'username', 'firstname', 'lastname', 'age', 'action'];

  constructor(private router: Router, private userService: UserService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.userService.getUsers()
      .pipe(retry(4), // se usa pipe para poder concatenar el reintento con el manejo de errores
        catchError(err => err.code === 404
        ? throwError('Not found')
        : throwError(err)))
      .subscribe( data => { // se subscribe al observable para poder recibir el mensaje
        console.log(data);
        this.users = data;
      });
  }

  deleteUser(user: User): void {
    if (confirm('Are you sure you want to delete user ' + user.firstName + ' ' + user.lastName)) {
      this.userService.deleteUser(user.id)
        .subscribe( data => {
          alert('Successfuly deleted!');
          this.users = this.users.filter(u => u !== user);
        });
    }
  }

  editUser(user: User): void {
    localStorage.removeItem('editUserId');
    localStorage.setItem('editUserId', user.id);
    this.router.navigate(['edit-user']);
  }

  addUser(): void {
    this.router.navigate(['add-user']);
  }

  logout(): void {
    this.appComponent.logout();
  }

}
