export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  birthDate: string;
  company?: {
    name: string;
    title: string;
    department: string;
    address?: {
      address: string;
      city: string;
    };
  };
  address?: {
    address: string;
    city: string;
    state: string;
  };
}

export interface UserResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
