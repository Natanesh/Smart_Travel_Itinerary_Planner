import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

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
  router = inject(Router);
  user = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    state: '',
  };
  register() {
    if (this.user.password !== this.user.confirm_password) {
      alert('Passwords do not match');
      return;
    }

    const payload: any = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      phone_number: this.user.phone_number,
      state: this.user.state,
    };

    this.http.post('http://localhost:3000/register', payload).subscribe({
      next: (res) => {
        alert('Registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Registration failed');
      },
    });
  }
}
