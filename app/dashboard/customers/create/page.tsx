import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateFormCustomers from "@/app/ui/customers/create-form";
import { addCustomer } from "@/app/lib/actions";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Create Customer",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <CreateFormCustomers />
    </main>
  );
}
