import { create } from "zustand";
import { fetchCustomers } from "./data";

type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

type AddCustomer = {
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

type CustomerStore = {
  customers: Customer[];
  add: (customer: Customer) => void;
  remove: (id: string) => void;
  update: (customer: Customer) => void;
};

export const useCustomersStore = create<CustomerStore>((set) => ({
  customers: [],
  add: (customer: AddCustomer) =>
    set((state: CustomerStore) => ({
      customers: [
        ...state.customers,
        {
          ...customer,
          id: String(Math.random().toString(36).substr(2, 9)),
        },
      ],
    })),
  remove: (id: string) =>
    set((state: CustomerStore) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    })),
  update: (customer: Customer) =>
    set((state: CustomerStore) => ({
      customers: [...state.customers, customer],
    })),
}));
