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



