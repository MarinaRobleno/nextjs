import { deleteCustomer } from "@/app/lib/actions";
import { useCustomersStore } from "@/app/lib/store";
import { TrashIcon } from "@heroicons/react/24/outline";

export function DeleteButton({ id }: { id: string }) {
  const deleteCustomerById = deleteCustomer.bind(null, id);
  return (
    <form action={deleteCustomerById}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
