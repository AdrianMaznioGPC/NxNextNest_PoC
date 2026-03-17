import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { Product } from "lib/types";
import SmartLink from "components/smart-link";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <SmartLink
            className="relative inline-block h-full w-full"
            href={product.path}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </SmartLink>
        </Grid.Item>
      ))}
    </>
  );
}
