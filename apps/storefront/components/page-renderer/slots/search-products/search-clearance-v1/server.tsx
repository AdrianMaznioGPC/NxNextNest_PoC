import Image from "next/image";
import SmartLink from "components/smart-link";
import Container from "components/layout/container";
import type { SlotRenderer } from "../../../slot-types";

const SearchProductsClearanceSlot: SlotRenderer<"page.search-products"> = ({
  products,
}) => {
  return (
    <Container className="pb-8">
      {products.length > 0 ? (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <SmartLink
                href={product.path}
                className="grid grid-cols-[96px_1fr] gap-4 p-4 sm:grid-cols-[120px_1fr]"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-md sm:h-[120px] sm:w-[120px]">
                  <Image
                    alt={product.featuredImage?.altText || product.title}
                    src={product.featuredImage?.url}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-control bg-price-badge px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-price-badge-foreground">
                    Clearance
                  </div>
                  <p className="text-sm font-bold text-black">
                    {product.priceRange.maxVariantPrice.amount}{" "}
                    {product.priceRange.maxVariantPrice.currencyCode}
                  </p>
                  <h2 className="text-base font-semibold text-black">
                    {product.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-neutral-600">
                    {product.description}
                  </p>
                </div>
              </SmartLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-700">No products found.</p>
      )}
    </Container>
  );
};

export default SearchProductsClearanceSlot;
