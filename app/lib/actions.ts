"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod";
import { signIn } from "@/auth";
import { useCustomersStore } from "./store";
import { CustomersTable, UpdateUser, UsersTable } from "./definitions";
import { hash } from "bcrypt";

// ...

// AUTHENTICATION

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialSignin";
    }
    throw error;
  }
}

// INVOICES

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Use Zod to update the expected types
const UpdateInvoice = InvoiceSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice" };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice" };
  }
}

// CUSTOMERS

const CreateCustomer = z.object({
  name: z.string({
    invalid_type_error: "Please enter a name.",
  }),
  email: z.string({
    invalid_type_error: "Please enter an email.",
  }),
  image_url: z.string({
    invalid_type_error: "Please enter an image URL.",
  }),
});

export async function addCustomer(customer: CustomersTable) {
  const validatedFields = CreateCustomer.safeParse({
    name: customer.name,
    email: customer.email,
    image_url: customer.image_url,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Add Customer.",
    };
  }

  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${customer.name}, ${customer.email}, ${customer.image_url})
    `;

    // Optionally, revalidate the data or navigate to the customers page
  } catch (error) {
    return { message: "Database Error: Failed to Add Customer" };
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;

    // Optionally, revalidate the data or navigate to the customers page
  } catch (error) {
    return { message: "Database Error: Failed to Delete Customer" };
  }
  revalidatePath("/dashboard/customers");
}

// USERS
const UserSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please enter a name.",
  }),
  email: z.string({
    invalid_type_error: "Please enter an email.",
  }),
  password: z.string({
    invalid_type_error: "Please enter a password.",
  }),
});
// CreateUser should omit the id field and include the "confirmPassword" field
const CreateUser = UserSchema.omit({ id: true }).extend({
  confirmPassword: z.string({
    invalid_type_error: "Please confirm your password.",
  }),
});

const UpdateUser = UserSchema.omit({ id: true, password: true });

export async function createUser(user: UsersTable) {
  const validatedFields = CreateUser.safeParse({
    name: user.name,
    email: user.email,
    password: user.password,
    confirmPassword: user.confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Add User.",
    };
  }

  // Check that the password and confirmPassword fields match
  if (user.password !== user.confirmPassword) {
    return {
      errors: { confirmPassword: ["Passwords do not match."] },
      message: "Passwords do not match. Failed to Add User.",
    };
  }

  const { name, email, password } = validatedFields.data;

  // Hash the password
  const hashedPassword = await hash(password, 10);

  try {
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Add User" };
  }
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
  } catch (error) {
    return { message: "Database Error: Failed to Delete User" };
  }
  revalidatePath("/dashboard/users");
}

export async function updateUser(user: UpdateUser) {
  const validatedFields = UpdateUser.safeParse({
    name: user.name,
    email: user.email,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User.",
    };
  }

  const { name, email } = validatedFields.data;

  try {
    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}
      WHERE id = ${user.id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update User" };
  }
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}
