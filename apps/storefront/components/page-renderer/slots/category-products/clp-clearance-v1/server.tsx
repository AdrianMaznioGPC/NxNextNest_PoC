import Image from "next/image";
import SmartLink from "components/smart-link";
import Breadcrumbs from "components/layout/breadcrumbs";
import Container from "components/layout/container";
import FilterList from "components/layout/search/filter";
import type { SlotRenderer } from "../../../slot-types";

const CategoryProductsClearanceSlot: SlotRenderer<"page.category-products"> = ({
  breadcrumbs,
  title,
  description,
  products,
  sortOptions,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "py-8"}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">{title}</h1>
        <div className="w-[220px]">
          <FilterList list={sortOptions} title="Sort by" />
        </div>
      </div>
      <p className="mb-8 mt-2 text-neutral-500">{description}</p>
      {!products.length ? (
        <p className="py-3 text-lg">No products found in this category</p>
      ) : (
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
      )}
    </Container>
  );
};

export default CategoryProductsClearanceSlot;
