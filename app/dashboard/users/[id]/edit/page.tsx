import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { getAllUsers, getUserById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import EditFormUsers from "@/app/ui/users/edit-form";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [user, users] = await Promise.all([getUserById(id), getAllUsers()]);
  if (!user) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Users", href: "/dashboard/users" },
          {
            label: "Edit Users",
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditFormUsers user={user!} users={users} />
    </main>
  );
}
