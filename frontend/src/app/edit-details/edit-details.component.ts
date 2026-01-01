import { Component, inject, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewDetails } from '../details/details-model';
import { AuthService } from '../auth/auth.service';
import { IndexComponent } from '../index/index.component';

@Component({
  selector: 'app-edit-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-details.component.html',
  styleUrl: './edit-details.component.css',
})
export class EditDetailsComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  index = inject(IndexComponent);
  http = inject(HttpClient);
  count = 0;
  itinerary!: ViewDetails;
  auth = inject(AuthService);

  editData = this.fb.group({
    place: ['', Validators.required],
    st_date: ['', Validators.required],
    end_date: ['', Validators.required],
    budget: ['', Validators.required],
    activities: this.fb.array([]),
  });

  ngOnInit(): void {
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else {
        this.auth.login();
        const data = history.state.itinerary;

        if (!data) {
          this.router.navigate(['/itineraries']);
          return;
        }
        this.auth.login();
        this.itinerary = data;

        this.editData.patchValue({
          place: data.destination,
          st_date: this.formatDate(data.start_date),
          end_date: this.formatDate(data.end_date),
          budget: data.budget,
        });

        this.loadActivitiesFromState();
        const initialDays = this.calculateDays(
          this.editData.value.st_date ?? '',
          this.editData.value.end_date ?? ''
        );
        this.syncActivities(initialDays);

        this.editData.valueChanges.subscribe((val) => {
          const days = this.calculateDays(
            val.st_date ?? '',
            val.end_date ?? ''
          );
          this.syncActivities(days);
        });
      }
    });
  }

  formatTimeToAmPm(time: string): string {
    if (!time) return '';

    const [h, m] = time.split(':');
    let hour = Number(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    return `${hour}:${m} ${ampm}`;
  }

  parseAmPmTo24(time: string): string {
    if (!time) return '';

    const [t, meridian] = time.trim().split(' ');
    let [h, m] = t.split(':').map(Number);

    if (meridian === 'PM' && h < 12) h += 12;
    if (meridian === 'AM' && h === 12) h = 0;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  loadActivitiesFromState() {
    const days = this.itinerary.activities?.days ?? [];

    this.activities.clear();

    days.forEach((d: any) => {
      const [start, end] = (d.visit_time ?? '').split(' - ');

      this.activities.push(
        this.fb.group({
          day: [d.day],
          from: [d.activities?.[0] ?? ''],
          to: [d.activities?.[1] ?? ''],
          visit_start: [this.parseAmPmTo24(start)],
          visit_end: [this.parseAmPmTo24(end)],
          travel_duration: [d.travel_duration ?? ''],
        })
      );
    });
  }

  get activities(): FormArray {
    return this.editData.get('activities') as FormArray;
  }

  createActivity(day: number) {
    return this.fb.group({
      day: [day],
      from: [''],
      to: [''],
      visit_start: [''], // ⬅️ NEW
      visit_end: [''], // ⬅️ NEW
      travel_duration: [''],
    });
  }

  syncActivities(days: number) {
    while (this.activities.length < days) {
      this.activities.push(this.createActivity(this.activities.length + 1));
    }

    while (this.activities.length > days) {
      this.activities.removeAt(this.activities.length - 1);
    }
  }

  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) return 0;

    return (
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  }

  submit() {
    if (this.editData.invalid) {
      alert('Please fill all fields');
      return;
    }

    const formValue = this.editData.value;

    const payload = {
      destination: formValue.place,
      start_date: formValue.st_date,
      end_date: formValue.end_date,
      budget: formValue.budget,
      activities: {
        days: (formValue.activities ?? []).map((a: any) => ({
          day: a.day,
          activities: [a.from, a.to],
          visit_time: `${this.formatTimeToAmPm(
            a.visit_start
          )} - ${this.formatTimeToAmPm(a.visit_end)}`,
          travel_duration: a.travel_duration,
        })),
      },
    };

    this.http
      .put(
        `http://localhost:3000/itineraries/edit/${this.itinerary.id}`,
        payload,
        { withCredentials: true }
      )
      .subscribe((res: any) => {
        try {
          alert('Itinerary Update Successfully!');
          this.router.navigate(['/itineraries']);
        } catch (err) {
          alert(err);
        }
      });
  }

  formatDate(date: string): string {
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    const p = date.split('-');
    return `${p[2]}-${p[1]}-${p[0]}`;
  }
}
