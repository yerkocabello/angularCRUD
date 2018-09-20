import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';
import {User} from '../model/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User;
  editForm: FormGroup;
  submitted = false;
  public ageModel = 0;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit() {
    const userId = localStorage.getItem('editUserId');
    if (!userId) {
      alert('Invalid action.');
      this.router.navigate(['list-user']);
      return;
    }
    this.editForm = this.formBuilder.group({
      id: [],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: [],
      image: [],
      age: ['', [Validators.required, Validators.min(15), Validators.pattern('^[0-9]*$'), Validators.max(90)]],
      roleId: [],
      createdAt: [],
      updatedAt: []
    });
    this.userService.getUserById(userId)
      .subscribe( data => {
        this.editForm.setValue(data);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    this.userService.updateUser(this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          alert('Successfuly updated!');
          this.router.navigate(['list-user']);
        },
        error => {
          alert(error);
        });
  }

}
