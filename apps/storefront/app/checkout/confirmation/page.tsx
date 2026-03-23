import Price from "components/price";
import { getOrderConfirmation } from "lib/api";
import type { OrderConfirmation } from "lib/types";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmationMessages } from "./confirmation-messages";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

interface ConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();

  let order: OrderConfirmation;
  try {
    order = await getOrderConfirmation(orderId);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <ConfirmationMessages orderNumber={order.orderNumber} />
      </div>

      {/* Items */}
      <div className="mb-6 rounded-lg border border-card-border">
        <div className="border-b border-card-border px-6 py-4">
          <ConfirmationMessages section="items" />
        </div>
        <div className="px-6">
          <ul className="divide-y divide-border">
            {order.lines.map((line, i) => (
              <li key={i} className="flex gap-4 py-3">
                <div className="relative h-16 w-16 flex-none rounded-md border border-card-border bg-muted-surface">
                  <Image
                    src={line.image.url}
                    alt={line.image.altText || line.title}
                    width={64}
                    height={64}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-surface">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-sm font-medium">{line.title}</p>
                  {line.variantTitle !== "Default Title" && (
                    <p className="text-xs text-muted">{line.variantTitle}</p>
                  )}
                </div>
                <Price
                  className="flex items-center text-sm font-medium"
                  amount={line.totalPrice.amount}
                  currencyCode={line.totalPrice.currencyCode}
                />
              </li>
            ))}
          </ul>

          <hr className="my-4 border-border" />

          <div className="space-y-2 pb-4 text-sm">
            <div className="flex justify-between text-muted">
              <ConfirmationMessages section="subtotalLabel" />
              <Price
                amount={order.cost.subtotalAmount.amount}
                currencyCode={order.cost.subtotalAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between text-muted">
              <ConfirmationMessages section="shippingLabel" />
              <Price
                amount={order.cost.shippingAmount.amount}
                currencyCode={order.cost.shippingAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between text-muted">
              <ConfirmationMessages section="taxesLabel" />
              <Price
                amount={order.cost.taxAmount.amount}
                currencyCode={order.cost.taxAmount.currencyCode}
              />
            </div>
            <hr className="my-2 border-border" />
            <div className="flex justify-between text-base font-semibold">
              <ConfirmationMessages section="totalLabel" />
              <Price
                amount={order.cost.totalAmount.amount}
                currencyCode={order.cost.totalAmount.currencyCode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-card-border p-4">
          <ConfirmationMessages section="deliveryMethodLabel" />
          <p className="mt-1 font-medium">{order.deliveryOption.label}</p>
          <p className="text-sm text-muted">
            {order.deliveryOption.description}
          </p>
        </div>
        <div className="rounded-lg border border-card-border p-4">
          <ConfirmationMessages section="paymentMethodLabel" />
          <p className="mt-1 font-medium">{order.paymentOption.label}</p>
          <p className="text-sm text-muted">
            {order.paymentOption.description}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-link hover:underline"
        >
          <ConfirmationMessages section="continueShopping" />
        </Link>
      </div>
    </div>
  );
}
