import { deleteCustomer } from "@/app/lib/actions";
import { useCustomersStore } from "@/app/lib/store";
import { TrashIcon } from "@heroicons/react/24/outline";

export const DeleteButton = ({ id }: { id: string }) => {
  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    useCustomersStore.setState((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    }));
  };
  return (
    <button
      className="text-red-500 hover:text-red-600"
      onClick={() => handleDeleteCustomer(id)}
    >
      <TrashIcon className="w-5" />
    </button>
  );
};
