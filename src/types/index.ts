export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: "male" | "female";
  username: string;
  password?: string;
  image: string;
  birthDate: string;
  phone: string;
}
