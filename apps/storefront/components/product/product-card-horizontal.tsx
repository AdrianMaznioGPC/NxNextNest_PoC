import { Badge, Price } from "@commerce/ui";
import { AddToCartButton } from "components/cart/add-to-cart-button";
import type { ListingProduct } from "lib/types";
import { listingProductUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductCardHorizontalProps {
  product: ListingProduct;
}

function StockBadge({ status, message }: { status: string; message: string }) {
  const variant =
    status === "in_stock"
      ? "success"
      : status === "low_stock"
        ? "warning"
        : status === "preorder"
          ? "secondary"
          : "destructive";

  return (
    <Badge variant={variant} className="text-[11px]">
      {message}
    </Badge>
  );
}

export default function ProductCardHorizontal({
  product,
}: ProductCardHorizontalProps) {
  const href = listingProductUrl(product);
  const title = product.variantTitle
    ? `${product.productTitle} \u2014 ${product.variantTitle}`
    : product.productTitle;

  return (
    <div className="group flex overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      {/* Image */}
      <Link
        href={href}
        prefetch={true}
        className="relative aspect-square w-[160px] shrink-0 overflow-hidden bg-neutral-100 sm:w-[200px] dark:bg-neutral-900"
      >
        {product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || title}
            fill
            sizes="200px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-4">
        <div>
          {/* Title */}
          <Link href={href} prefetch={true}>
            <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
              {title}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
            {product.description}
          </p>
        </div>

        {/* Price + Stock + Add to Cart */}
        <div className="flex flex-wrap items-center gap-3">
          {product.price && (
            <Price
              amount={product.price.amount}
              currencyCode={product.price.currencyCode}
              className="text-lg font-bold text-neutral-900 dark:text-white"
              currencyCodeClassName="sr-only"
            />
          )}
          <StockBadge
            status={product.stockStatus}
            message={product.stockMessage}
          />
          <div className="ml-auto">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
