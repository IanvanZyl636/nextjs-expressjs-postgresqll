import { serverApiFetch } from '@/lib/api/server-api-client';

async function fetchVendor(slug: string) {
  const res = await serverApiFetch(`/api/vendor/${slug}`, { forwardClientHeaders: true, cache: 'no-store' });

  if (!res.ok) return null;

  return res.json();
}

export default async function VendorDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const vendor = await fetchVendor((await params).slug);

  if (!vendor) return <div className="p-8">Vendor not found or you don't have access.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{vendor.name} Dashboard</h1>
      <p className="text-sm text-muted-foreground">{vendor.description}</p>
     
    </div>
  );
}
