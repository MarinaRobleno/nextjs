// components/CreateFormCustomers.tsx
"use client";
import React from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addCustomer } from "@/app/lib/actions";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { useCustomersStore } from "@/app/lib/store";
import { redirect } from "next/navigation";

// Define the schema for validation using Zod
const schema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  image_url: z.string().url(),
  total_invoices: z.number().default(0),
  total_pending: z.number().default(0),
  total_paid: z.number().default(0),
});

// Define the default values for non-editable fields
const defaultValues = {
  id: String(Math.random().toString(36).substr(2, 9)),
  total_invoices: 0,
  total_pending: 0,
  total_paid: 0,
};

interface FormValues {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
}

interface CreateFormCustomersProps {}

const CreateFormCustomers: React.FC<CreateFormCustomersProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues, // Set default values for the form
  });
  const { add } = useCustomersStore();

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("doing this");

      // Add the customer to the store

      console.log("added to store");
      await addCustomer(data);
      add(data);
      //   navigate to the customers page
      redirect("/dashboard/customers");
    } catch (error) {
      console.error("Error adding customer:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* <h1 className="text-2xl mb-4">Create Customer</h1> */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-500"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="image_url"
              className="block text-sm font-medium mb-2"
            >
              Image URL
            </label>
            <input
              type="text"
              id="image_url"
              {...register("image_url")}
              className="w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-500"
            />
            {errors.image_url && (
              <p className="text-sm text-red-500 mt-1">
                {errors.image_url.message}
              </p>
            )}
          </div>

          {/* Non-editable fields */}
          <input type="hidden" {...register("total_invoices")} />
          <input type="hidden" {...register("total_pending")} />
          <input type="hidden" {...register("total_paid")} />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Create Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFormCustomers;
