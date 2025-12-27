import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IndexComponent } from '../../index/index.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './itinerary-list.component.html',
})
export class ItineraryListComponent implements OnInit {
  ngOnInit(): void {
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    });
  }
  auth = inject(AuthService);
  index = inject(IndexComponent);
  router = inject(Router);
  itineraries = [
    {
      destination: 'Goa',
      days: 5,
      budget: 30000,
    },
    {
      destination: 'Manali',
      days: 7,
      budget: 45000,
    },
  ];
}
