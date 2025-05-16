export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "DRIVER";
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

export interface Vehicle {
  id: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  vehicle_class: string;
  available: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleFormInput {
  id?: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  vehicle_class: string;
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
  dropoff: {
    lat: number;
    lng: number;
    address: string;
  };
  status: "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
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
  logo_url?: string;
  theme: {
    primary_color?: string;
    [key: string]: any;
  };
  pricing?: {
    base_fare: number;
    per_mile: number;
    per_minute: number;
    night_surcharge: number;
    city_modifier: number;
    class_multiplier: {
      suv: number;
    }
  }
  created_at: string;
  updated_at: string;
}

export interface CompanyForm {
  name: string;
  logo_url?: string;
  theme?: {
    primary_color?: string;
    secondary_color?: string;
    [key: string]: any;
  };
  pricing?: {
    base_fare: number;
    per_mile: number;
    per_minute: number;
    night_surcharge: number;
    city_modifier: number;
    class_multiplier: {
      suv: number;
    }
  }
}



