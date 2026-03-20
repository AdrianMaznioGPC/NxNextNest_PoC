import { Container } from "@commerce/ui";
import Breadcrumbs from "components/layout/breadcrumbs";
import { Gallery } from "components/product/gallery";
import { ProductDescription } from "components/product/product-description";
import ProductRecommendations from "components/product/product-recommendations";
import { getProductPageData, getStoreCode } from "lib/api";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import type { Image } from "lib/types";
import { productUrl } from "lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ params: string[] }> };

function parseProductParams(
  segments: string[],
): { slug: string; productId: string } | null {
  if (segments.length === 3 && segments[1] === "p") {
    return { slug: segments[0]!, productId: segments[2]! };
  }
  return null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params: segments } = await props.params;
  const parsed = parseProductParams(segments);
  if (!parsed) return notFound();

  try {
    const storeCode = await getStoreCode();
    const { product } = await getProductPageData(storeCode, parsed.productId);
    const { url, width, height, altText: alt } = product.featuredImage || {};
    const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

    return {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
      robots: {
        index: indexable,
        follow: indexable,
        googleBot: { index: indexable, follow: indexable },
      },
      openGraph: url ? { images: [{ url, width, height, alt }] } : null,
    };
  } catch {
    return notFound();
  }
}

export default async function ProductPage(props: Props) {
  const { params: segments } = await props.params;
  const parsed = parseProductParams(segments);
  if (!parsed) return notFound();

  const storeCode = await getStoreCode();

  let data;
  try {
    data = await getProductPageData(storeCode, parsed.productId);
  } catch {
    return notFound();
  }

  const { product, canonicalSlug, breadcrumbs, recommendations } = data;
  const tBreadcrumbs = await getTranslations("breadcrumbs");
  const tProduct = await getTranslations("product");
  const allBreadcrumbs = [
    { title: tBreadcrumbs("home"), path: "/" },
    ...breadcrumbs,
  ];

  if (parsed.slug !== canonicalSlug) {
    redirect(productUrl(product));
  }

  const { minVariantPrice, maxVariantPrice } = product.priceRange;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers:
      minVariantPrice && maxVariantPrice
        ? {
            "@type": "AggregateOffer",
            availability: product.purchasable
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            priceCurrency: minVariantPrice.currencyCode,
            highPrice: maxVariantPrice.amount,
            lowPrice: minVariantPrice.amount,
          }
        : {
            "@type": "Offer",
            availability: "https://schema.org/OutOfStock",
          },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Container>
        <Breadcrumbs items={allBreadcrumbs} />
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
        <ProductRecommendations
          products={recommendations}
          heading={tProduct("relatedProducts")}
        />
      </Container>
    </>
  );
}
