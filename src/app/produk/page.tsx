import ProductExplorerView from "@/components/ProductExplorerView";
import { getProducts, getCategories } from "@/lib/actions/products";

export const instant = false;

export default async function FullCatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ProductExplorerView
      initialProducts={products}
      categories={categories}
    />
  );
}
