import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { HouseDetailView } from "@/components/HouseDetailView";
import { HOUSES, getHouseById } from "@/lib/houses";

export function generateStaticParams() {
  return HOUSES.map((h) => ({ id: h.id }));
}

export default async function HouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const house = getHouseById(id);
  if (!house) notFound();

  return (
    <>
      <SiteHeader />
      <HouseDetailView house={house} />
    </>
  );
}
