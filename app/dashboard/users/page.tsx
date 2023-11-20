import React, { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import { getUsersPages } from "@/app/lib/data";
import Pagination from "@/app/ui/users/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/users/table";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { CreateUser } from "@/app/ui/users/buttons";

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
  const totalPages = await getUsersPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
        <CreateUser />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
