import PublicWebsiteView from "@/components/PublicWebsiteView";
import { getProducts, getCategories } from "@/lib/actions/products";
import { getParcels } from "@/lib/actions/parcels";
import { getGalleries } from "@/lib/actions/gallery";
import { getTestimonials } from "@/lib/actions/testimonials";
import { getContactSettings } from "@/lib/actions/settings";
import { StoreContact } from "@/types";

export const instant = false;

export default async function Home() {
  const [products, categories, parcels, galleries, testimonials, contact] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getParcels(),
      getGalleries(),
      getTestimonials(),
      getContactSettings(),
    ]);

  return (
    <PublicWebsiteView
      products={products}
      categories={categories}
      parcels={parcels}
      galleries={galleries}
      testimonials={testimonials}
      contact={contact as StoreContact}
    />
  );
}
