// Day wise activities
export interface DayActivity {
  day: number;
  activities: string[];
  visit_time: string;
  travel_duration: string;
}

// Activities wrapper
export interface Activities {
  days: DayActivity[];
}
export interface Conatct {
  state: string;
  phone_number: string;
}
// Main itinerary interface
export interface ViewDetails {
  id: number;
  user_id: number;
  name: string;
  contact_info: Conatct;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  activities: Activities;
  notes: string | null;
  media_paths: string | null;
  created_at: string;
}
