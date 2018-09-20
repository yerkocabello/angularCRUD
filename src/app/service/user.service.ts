import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user.model';
import {expressEnvironment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
  baseUrl = expressEnvironment.apiUrl + '/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(user: User) {
    console.log(user.id);
    return this.http.put(this.baseUrl + '/' + user.id, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + id);
  }
}
