import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  isLoggedIn = false;

  login() {
    this.isLoggedIn = true;
  }
  logout() {
    this.isLoggedIn = false;
    this.http
      .post('http://localhost:3000/logout', {}, { withCredentials: true })
      .subscribe((res: any) => {
        this.router.navigate(['/login']);
      });
  }
  viewDetails(user_id: any, id: any) {
    this.router.navigate([`itineraries/user_${user_id}_${id}`]);
  }
}
