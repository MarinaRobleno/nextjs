import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateFormUsers from "@/app/ui/users/create-form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Users", href: "/dashboard/users" },
          {
            label: "Create User",
            href: "/dashboard/users/create",
            active: true,
          },
        ]}
      />
      <CreateFormUsers />
    </main>
  );
}
