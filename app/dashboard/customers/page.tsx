// page.tsx
import Table from "@/app/ui/customers/table";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

import { useCustomersStore } from "@/app/lib/store";
import { fetchCustomers } from "@/app/lib/data";
import StoreInitializer from "@/app/ui/customers/store-initializer";

export default async function Page() {
  const customers = await fetchCustomers();
  useCustomersStore.setState({ customers });

  return (
    <div className="w-full">
      <StoreInitializer customers={customers} />
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>

      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Table />
      </Suspense>
    </div>
  );
}
