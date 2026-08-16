import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/api/catalog";
import Breadcrumb from "@/components/common/Breadcrumb";
import Reveal from "@/components/home/Reveal";
import ErrorState from "@/components/home/ErrorState";
import ProductGridSkeleton from "@/components/home/ProductGridSkeleton";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductActions from "@/components/product-detail/ProductActions";
import ReviewsSectionLoader from "@/components/product-detail/ReviewsSectionLoader";
import ReviewsSkeleton from "@/components/product-detail/ReviewsSkeleton";
import RelatedProducts from "@/components/product-detail/RelatedProducts";

// Stock, rating and review counts change often, so this route always
// renders per-request rather than being statically cached.
export const dynamic = "force-dynamic";

/**
 * NOTE: the dynamic segment folder is [slug] (established in an
 * earlier feature) rather than [id] — renaming it would restructure
 * routing set up in a completed feature, so it's kept as-is. The
 * value it receives is the product's Mongo _id (ProductCard already
 * links to /products/${product._id}), so the URL shape matches what
 * was requested; only the internal param name differs.
 */
export default async function ProductDetailsPage({ params }) {
  const { slug: productId } = await params;

  let product = null;
  let hasError = false;

  try {
    const data = await getProductById(productId);
    product = data?.product ?? (data?._id ? data : null);
  } catch {
    hasError = true;
  }

  if (hasError) {
    return (
      <section className="container-fb py-16 lg:py-24">
        <ErrorState description="We couldn't load this product right now." />
      </section>
    );
  }

  if (!product) {
    notFound();
  }

  const gallery = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean);

  const breadcrumbItems = product.category?.name
    ? [
        { label: "Products", href: "/products" },
        { label: product.category.name, href: `/products?category=${product.category._id}` },
        { label: product.name },
      ]
    : [{ label: "Products", href: "/products" }, { label: product.name }];

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <ProductGallery images={gallery} alt={product.name} />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <ProductInfo product={product} />
            <ProductActions product={product} />
          </div>
        </Reveal>
      </div>

      <div className="mt-16 lg:mt-20">
        <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Customer reviews</h2>
        <div className="mt-6">
          <Suspense fallback={<ReviewsSkeleton />}>
            <ReviewsSectionLoader productId={product._id} />
          </Suspense>
        </div>
      </div>

      <div className="mt-16 lg:mt-20">
        <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Related products</h2>
        <div className="mt-6">
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <RelatedProducts categoryId={product.category?._id} excludeId={product._id} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
