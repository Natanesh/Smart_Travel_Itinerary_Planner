import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { IndexComponent } from '../../index/index.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Itinerary } from './itinerary-model';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './itinerary-list.component.html',
  styleUrl: './itinerary-list.component.css',
})
export class ItineraryListComponent implements OnInit {
  auth = inject(AuthService);
  index = inject(IndexComponent);
  router = inject(Router);
  http = inject(HttpClient);

  itineraries: Itinerary[] = [];
  originalItineraries: any[] = [];

  destinationFilter: string = '';
  maxBudgetFilter: number | null = null;
  startDateFilter: string = '';
  endDateFilter: string = '';

  user_id: any = undefined;

  activeTab: 'current' | 'past' = 'current';

  ngOnInit(): void {
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else {
        this.user_id = res.id;
        this.auth.login();
        this.listItineraries();
      }
    });
  }

  listItineraries() {
    this.http
      .get<Itinerary[]>('http://localhost:3000/itineraries', {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        this.originalItineraries = res;
        this.itineraries = this.originalItineraries;
        for (let i = 0; i < this.itineraries.length; i++) {
          let start = this.itineraries[i].start_date.split('T')[0].split('-');
          let end = this.itineraries[i].end_date.split('T')[0].split('-');
          this.itineraries[i].start_date =
            '' + start[2] + '-' + ('' + start[1]) + '-' + ('' + start[0]);
          this.itineraries[i].end_date =
            '' + end[2] + '-' + ('' + end[1]) + '-' + ('' + end[0]);
        }
        this.applyFilters();
      });
  }

  applyFilters() {
    let filtered = this.originalItineraries.slice();

    if (this.destinationFilter && this.destinationFilter.trim() !== '') {
      const q = this.destinationFilter.trim().toLowerCase();
      filtered = filtered.filter((it: any) =>
        (it.destination || '').toLowerCase().includes(q)
      );
    }

    if (this.maxBudgetFilter !== null && this.maxBudgetFilter !== undefined) {
      filtered = filtered.filter((it: any) => {
        const b = Number(it.budget || 0);
        return !isNaN(b) && b <= Number(this.maxBudgetFilter);
      });
    }

    if (this.startDateFilter) {
      const s = new Date(this.startDateFilter);
      filtered = filtered.filter((it: any) => new Date(it.end_date) >= s);
    }

    if (this.endDateFilter) {
      const e = new Date(this.endDateFilter);
      filtered = filtered.filter((it: any) => new Date(it.end_date) <= e);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered =
      this.activeTab === 'current'
        ? filtered.filter((it: any) => new Date(it.end_date) >= today)
        : filtered.filter((it: any) => new Date(it.end_date) < today);

    this.itineraries = filtered;
  }

  setTab(tab: 'current' | 'past') {
    this.activeTab = tab;
    this.applyFilters();
  }

  clearFilters() {
    this.destinationFilter = '';
    this.maxBudgetFilter = null;
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyFilters();
  }
}
