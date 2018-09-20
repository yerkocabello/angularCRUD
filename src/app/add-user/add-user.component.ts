import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  submitted = false;
  public ageModel = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  addForm: FormGroup;

  ngOnInit() {

    this.addForm = this.formBuilder.group({
      id: [],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username : ['', Validators.required],
      age: ['', [Validators.required, Validators.min(15), Validators.pattern('^[0-9]*$'), Validators.max(90)]],
      password : ['', [Validators.required, Validators.maxLength(6), Validators.minLength(4)]]
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.userService.createUser(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['list-user']);
      });
  }

}
