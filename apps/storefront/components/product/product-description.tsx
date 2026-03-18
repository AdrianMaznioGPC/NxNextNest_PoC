import { Badge, Price, Prose, Separator } from "@commerce/ui";
import { AddToCart } from "components/cart/add-to-cart";
import { Product } from "lib/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col pb-6">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        {product.priceRange.maxVariantPrice ? (
          <Badge className="mr-auto rounded-full px-3 py-1.5">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </Badge>
        ) : null}
        <Separator className="mt-6" />
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
