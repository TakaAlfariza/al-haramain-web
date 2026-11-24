import ParcelExplorerView from "@/components/ParcelExplorerView";
import { getParcels } from "@/lib/actions/parcels";

export const instant = false;

export default async function FullParcelPage() {
  const parcels = await getParcels();

  return <ParcelExplorerView initialParcels={parcels} />;
}
