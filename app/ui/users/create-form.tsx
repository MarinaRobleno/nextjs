"use client";

import { createUser } from "@/app/lib/actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  confirmPassword: z.string().min(6).max(50),
});

const defaultValues = {
  id: String(Math.random().toString(36).substr(2, 9)),
};

interface FormValues {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CreateFormUsersProps {}

const CreateFormUsers: React.FC<CreateFormUsersProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues, // Set default values for the form
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createUser(data);
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
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-500"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Non-editable fields */}
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/users"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex h-10 items-center rounded-lg bg-purple-500 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFormUsers;
