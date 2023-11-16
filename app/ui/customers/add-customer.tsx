"use client";

import { useCustomersStore } from "@/app/lib/store";
import { lusitana } from "@/app/ui/fonts";
import { Button } from "../button";

export default function AddCustomerButton() {
  const dummyCustomer = {
    id: "1",
    name: "John Doe",
    email: "john@mail.com",
    total_invoices: 10,
    total_pending: 5,
    total_paid: 5,
    image_url: "https://i.pravatar.cc/300?img=1",
  };

  const { add } = useCustomersStore();

  return (
    <Button
      onClick={() => add(dummyCustomer)}
      className="flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
    >
      Add Dummy
    </Button>
  );
}
