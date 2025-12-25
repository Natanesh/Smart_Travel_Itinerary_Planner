import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {}
  http = inject(HttpClient);
  user = {
    name: '',
    email: '',
    password: '',
    phone_number: '',
    state: '',
  };
  register() {
    console.log('Hello');
    this.http.post('http://localhost:3000/register', this.user).subscribe();
  }
}
