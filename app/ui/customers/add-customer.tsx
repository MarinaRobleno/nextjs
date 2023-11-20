import { useCustomersStore } from "@/app/lib/store";
import { Button } from "../button";
import { addCustomer } from "@/app/lib/actions";
import Link from "next/link";

export default function AddCustomerButton() {
  const dummyCustomer = {
    id: String(Math.random().toString(36).substr(2, 9)),
    name: "Jane Doe",
    email: "john@mail.com",
    total_invoices: 10,
    total_pending: 5,
    total_paid: 5,
    image_url: "https://i.pravatar.cc/300?img=1",
  };

  const handleAddCustomer = () => {
    addCustomer(dummyCustomer);
    useCustomersStore.setState((state) => ({
      customers: [...state.customers, dummyCustomer],
    }));
  };

  return (
    // <Button
    //   onClick={handleAddCustomer}
    //   className="flex items-center justify-center rounded-lg bg-purple-500 hover:bg-purple-600 text-white px-4 py-2"
    // >
    //   Add Dummy
    // </Button>
    <Link href="/dashboard/customers/create">
      <Button className="flex items-center justify-center rounded-lg bg-purple-500 hover:bg-purple-600 text-white px-4 py-2">
        Add a new customer
      </Button>
    </Link>
  );
}
