import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  http = inject(HttpClient);
  router = inject(Router);
  user = { email: '', password: '' };

  login() {
    this.http.post('http://localhost:3000/login', this.user).subscribe({
      next: (resp: any) => {
        if (resp && resp.token) {
          localStorage.setItem('token', resp.token);
          alert('Login successful');
          this.router.navigate(['/']);
        } else {
          alert('Login failed');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Login failed');
      },
    });
  }
}
