import { getAdminMovies } from "@/actions/admin";
import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Archivist Vault | Admin",
};

export default async function AdminPage({ searchParams }) {
  // Await searchParams for Next.js 14/15 compatibility
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const search = params.search || "";
  const filter = params.filter || "all";

  // Fetch the data using the server action we created
  const data = await getAdminMovies({ page, search, filter });

  return (
    <div className="min-h-screen bg-noir pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <span className="text-gold font-mono text-xs uppercase tracking-widest mb-2 block">
              Database Operations
            </span>
            <h1 className="text-4xl font-serif font-bold text-silver">
              Curator Dashboard
            </h1>
          </div>
          <div className="text-right">
            <p className="text-pewter font-mono text-sm">
              Total Indexed:{" "}
              <span className="text-silver">
                {data.totalMovies.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Load the Interactive Client UI */}
        <AdminClient
          initialData={data}
          currentPage={page}
          currentSearch={search}
          currentFilter={filter}
        />
      </div>
    </div>
  );
}
