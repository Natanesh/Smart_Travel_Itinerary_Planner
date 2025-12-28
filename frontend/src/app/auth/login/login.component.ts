import { Component, inject, Injectable, OnInit, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
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
  auth = inject(AuthService);
  login() {
    this.http
      .post('http://localhost:3000/login', this.user, {
        withCredentials: true,
      })
      .subscribe({
        next: (resp: any) => {
          if (resp && resp.token) {
            this.auth.login();
            this.router.navigate(['/itineraries']);
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
