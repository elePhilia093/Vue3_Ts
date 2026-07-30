export interface CustomerItem {
  customerId: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type CustomerListResponse = CustomerItem[];