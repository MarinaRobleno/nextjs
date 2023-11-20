// page.tsx
import Table from "@/app/ui/customers/table";
import { poppins } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

import { useCustomersStore } from "@/app/lib/store";
import { fetchCustomers, fetchCustomersPages } from "@/app/lib/data";
import StoreInitializer from "@/app/ui/customers/store-initializer";
import AddCustomerButton from "@/app/ui/customers/add-customer";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/customers/pagination";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);
  // console.log("customers", customers);
  // useCustomersStore.setState({ customers });

  return (
    <div className="w-full">
      {/* <StoreInitializer customers={customers} /> */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${poppins.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <AddCustomerButton />
      </div>

      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
