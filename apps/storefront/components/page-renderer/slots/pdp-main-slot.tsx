import Container from "components/layout/container";
import Breadcrumbs from "components/layout/breadcrumbs";
import { Gallery } from "components/product/gallery";
import { ProductDescription } from "components/product/product-description";
import { Suspense } from "react";
import type { SlotRenderer } from "../slot-types";

const PdpMainSlot: SlotRenderer<"page.pdp-main"> = ({
  product,
  breadcrumbs,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          >
            <Gallery
              images={product.images.slice(0, 5).map((image) => ({
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
    </Container>
  );
};

export default PdpMainSlot;
