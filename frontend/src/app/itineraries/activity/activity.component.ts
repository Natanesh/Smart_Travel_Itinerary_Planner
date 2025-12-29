import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent implements OnInit {

  activityForm!: FormGroup;
  daysCount = 0;
  itinerary: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 🔹 Get itinerary data from navigation state
    this.itinerary = history.state.itinerary;

    if (!this.itinerary) {
      this.router.navigate(['/create-itinerary']);
      return;
    }

    // 🔹 Calculate number of days
    this.daysCount = this.calculateDays(
      this.itinerary.start_date,
      this.itinerary.end_date
    );

    // 🔹 Build reactive form
    this.buildForm();
  }

  // 🔹 Calculate days between dates
  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return (
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1
    );
  }

  // 🔹 Build dynamic form based on days
  buildForm(): void {
    this.activityForm = this.fb.group({
      activities: this.fb.array([])
    });

    for (let i = 1; i <= this.daysCount; i++) {
      this.activities.push(
        this.fb.group({
          day: [`Day ${i}`],
          activity: ['', Validators.required]
        })
      );
    }
  }

  // 🔹 Getter for FormArray
  get activities(): FormArray {
    return this.activityForm.get('activities') as FormArray;
  }

  // 🔹 Submit activities
  submitActivities(): void {

  // 🔴 If form is invalid
  if (this.activityForm.invalid) {

    // Mark all fields as touched to show errors
    this.activityForm.markAllAsTouched();

    alert('Please fill all activities before submitting');
    return;
  }

  // ✅ If valid
  console.log(this.activityForm.value);

  alert('Activities added successfully');

  this.router.navigate(['/itineraries']);
}
}