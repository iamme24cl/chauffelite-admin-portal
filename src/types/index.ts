interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Driver {
  id: string;
  company_id: string;
  user: User; 
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
  company_id: string;
  craeted_at: string;
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



