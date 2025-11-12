export interface ProductRating {
  rate?: number;
  count?: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: {
    rate: number;
    count: number;
  };
  gallery?: string[];
}
 export interface getNewProduct {
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string,
 }

 export interface getProductById {
  id: number,
 }

 export interface updateProduct {
  id: number,
  title:string,
  price: number,
  description: string,
  category:string,
  image: string,
 }
  
export interface deleteProduct{
  id: number,
} 

