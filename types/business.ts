export type ProductCategory =
  | "minuman"
  | "gorengan"
  | "kolak"
  | "kue"
  | "es"
  | "lainnya";

export interface BusinessInput {
  location: string;
  capital: number;
  category: ProductCategory;
  mayarLink: string;
}

export interface GenerateRequest extends BusinessInput {
  count?: number;
  excludeProducts?: string[];
}

export interface ProductRecommendation {
  name: string;
  description: string;
  estimatedCost: number;
  sellingPrice: number;
  estimatedProfit: number;
  tips: string;
}

export interface BusinessPlan {
  input: BusinessInput;
  recommendations: ProductRecommendation[];
  storeName: string;
  tagline: string;
  totalEstimatedProfit: number;
}