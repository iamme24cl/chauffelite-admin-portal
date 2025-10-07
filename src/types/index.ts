export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "PARTNER_ADMIN" | "DRIVER";
  company_id?: string;
}

export interface Driver {
  id: string;
  company_id: string;
  user: User; 
  available: boolean;
  created_at: string;
  updated_at: string;
}

export type DriverFormInput = {
  user:
    {
      name: string;
      phone: string;
      email?: string;
      password?: string;
    } 
};

export interface VehicleClass {
  id: string;
  title: string; // e.g., "SUV", "Sedan"
  key: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  vehicle_class: VehicleClass;
  available: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
  pricing?: {
    ONE_WAY?: {
      base_fare: number;
      per_mile: number;
      per_minute: number;
      night_surcharge?: number;
      city_modifier?: number;
    };
    ROUND_TRIP?: {
      base_fare: number;
      per_mile: number;
      per_minute: number;
      night_surcharge?: number;
      city_modifier?: number;
    };
    HOURLY?: {
      hourly_rate?: number;
      min_hours?: number;
    };
  };
}

export interface VehicleFormInput {
  id?: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  vehicle_class: string; // still submit just the class ID to the backend
  pricing?: {
    ONE_WAY?: {
      base_fare: number;
      per_mile: number;
      per_minute: number;
      night_surcharge?: number;
      city_modifier?: number;
    };
    ROUND_TRIP?: {
      base_fare: number;
      per_mile: number;
      per_minute: number;
      night_surcharge?: number;
      city_modifier?: number;
    };
    HOURLY?: {
      hourly_rate?: number;
      min_hours?: number;
    };
  };
}

export interface Ride {
  id: string;
  company_id: string;
  vehicle_class: string;
  rider_id: string;
  driver_id?: string;
  vehicle_id?: string;
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoff?: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  status: "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  trip_type?: "ONE_WAY" | "ROUND_TRIP" | "HOURLY"; 
  fare?: number;                                 
  scheduled_start?: string;                      
  scheduled_end?: string;  
  return_shceduled_start?: string;
  return_scheduled_end?: string;                      
  created_at: string;
  updated_at: string;
}

export interface RideSession {
  driver_location: {
    lat: number;
    lng: number;
  };
  status: Ride["status"];
  updated_at: number;
}

export interface Company {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  theme: {
    primary_color?: string;
    secondary_color?: string;
    [key: string]: any;
  };
  support_email?: string;
  support_phone?: string;
  location?: {
    lat?: number;
    lng?: number;
    [key: string]: any;
  };
  gallery?: string[];
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface CompanyForm {
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  theme?: {
    primary_color?: string;
    secondary_color?: string;
    [key: string]: any;
  };
  support_email?: string;
  support_phone?: string;
  location?: {
    lat?: number;
    lng?: number;
    [key: string]: any;
  };
  gallery?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}




