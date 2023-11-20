"use client";

import { updateUser } from "@/app/lib/actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDb } from "@/app/lib/definitions";
import Link from "next/link";

const schema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

interface FormValues {
  id: string;
  name: string;
  email: string;
}

interface EditFormUsersProps {
  user: UserDb;
  users: UserDb[];
}

const EditFormUsers: React.FC<EditFormUsersProps> = ({
  user,
  users,
}: {
  user: UserDb;
  users: UserDb[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: user, // Set default values for the form
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updateUser(data);
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  return (
    <div className="container mx-auto mt-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* <h1 className="text-2xl mb-4">Edit User</h1> */}
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
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text
            -sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/users"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFormUsers;
