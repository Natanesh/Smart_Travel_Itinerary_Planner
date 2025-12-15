import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  login(role: 'user' | 'admin') {
    localStorage.setItem('role', role);
    localStorage.setItem('isLoggedIn', 'true');

    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/itineraries']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
