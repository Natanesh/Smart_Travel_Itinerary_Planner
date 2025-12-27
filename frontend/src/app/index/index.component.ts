import { HttpClient } from '@angular/common/http';
import { Component, inject, Injectable, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  ngOnInit(): void {
    this.currentUser().subscribe((res: any) => {
      if (res.id != undefined) {
        this.auth.login();
        this.router.navigate(['/home']);
      }
    });
  }
  auth = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  currentUser() {
    return this.http.get('http://localhost:3000', { withCredentials: true });
  }
}
