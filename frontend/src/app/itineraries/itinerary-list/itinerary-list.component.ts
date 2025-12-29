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
  listItineraries() {
    this.http
      .get<Itinerary[]>('http://localhost:3000/itineraries', {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        this.originalItineraries = res;
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
      filtered = filtered.filter((it: any) => new Date(it.start_date) >= s);
    }

    if (this.endDateFilter) {
      const e = new Date(this.endDateFilter);
      filtered = filtered.filter((it: any) => new Date(it.end_date) <= e);
    }

    this.itineraries = filtered.map((it: any) => {
      const copy = { ...it } as any;
      try {
        const s = new Date(it.start_date);
        const e = new Date(it.end_date);
        const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
        copy.start_date = `${pad(s.getDate())}-${pad(s.getMonth() + 1)}-${s.getFullYear()}`;
        copy.end_date = `${pad(e.getDate())}-${pad(e.getMonth() + 1)}-${e.getFullYear()}`;
      } catch (err) {}
      return copy;
    });
  }

  clearFilters() {
    this.destinationFilter = '';
    this.maxBudgetFilter = null;
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyFilters();
  }

  deleteItinerary(id: number) {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      this.http
        .delete(`http://localhost:3000/itineraries/${id}`, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            // Remove the deleted itinerary from the local array
            this.itineraries = this.itineraries.filter(
              (item) => item.id !== id
            );
            alert('Itinerary deleted successfully');
          },
          error: (err) => {
            console.error('Error deleting itinerary:', err);
            alert('Failed to delete itinerary. Please try again.');
          },
        });
    }
  }
}
