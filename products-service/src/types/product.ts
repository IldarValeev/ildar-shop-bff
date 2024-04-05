export interface IProduct {
    /** Available count */
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
  }

  export type ProductsList = IProduct[];
