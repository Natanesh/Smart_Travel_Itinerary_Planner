import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itinerary-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './itinerary-create.component.html',
  styleUrls: ['./itinerary-create.component.css']
})
export class CreateItineraryComponent {
  itineraryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.itineraryForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  goToActivities(): void {
    if (this.itineraryForm.valid) {
      const { startDate, endDate } = this.itineraryForm.value;

      // calculate number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days =
        Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      // pass days to activity page
      this.router.navigate(['/activities'], {
        state: { days }
      });
    } else {
      this.itineraryForm.markAllAsTouched();
    }
  }
}
