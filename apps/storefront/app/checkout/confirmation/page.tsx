import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Price,
  Separator,
} from "@commerce/ui";
import { getOrderConfirmation, getStoreCode } from "lib/api";
import type { OrderConfirmation } from "lib/types";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("orderConfirmation");
  return { title: t("title") };
}

interface ConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();

  const storeCode = await getStoreCode();
  const t = await getTranslations("orderConfirmation");

  let order: OrderConfirmation;
  try {
    order = await getOrderConfirmation(storeCode, orderId);
  } catch {
    notFound();
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
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
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {t("thankYou")}
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
            {t("orderNumber", { orderNumber: order.orderNumber })}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("items")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {order.lines.map((line, i) => (
                <li key={i} className="flex gap-4 py-3">
                  <div className="relative h-16 w-16 flex-none rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                    <Image
                      src={line.image.url}
                      alt={line.image.altText || line.title}
                      width={64}
                      height={64}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-white dark:bg-neutral-200 dark:text-black">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {line.title}
                    </p>
                    {line.variantTitle !== "Default Title" && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {line.variantTitle}
                      </p>
                    )}
                  </div>
                  <Price
                    className="flex items-center text-sm font-medium text-black dark:text-white"
                    amount={line.totalPrice.amount}
                    currencyCode={line.totalPrice.currencyCode}
                  />
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{t("subtotal")}</span>
                <Price
                  amount={order.cost.subtotalAmount.amount}
                  currencyCode={order.cost.subtotalAmount.currencyCode}
                  className="text-black dark:text-white"
                />
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{t("shipping")}</span>
                <Price
                  amount={order.cost.shippingAmount.amount}
                  currencyCode={order.cost.shippingAmount.currencyCode}
                  className="text-black dark:text-white"
                />
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{t("taxes")}</span>
                <Price
                  amount={order.cost.taxAmount.amount}
                  currencyCode={order.cost.taxAmount.currencyCode}
                  className="text-black dark:text-white"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <span className="text-base font-semibold">{t("total")}</span>
              <Price
                className="text-base font-semibold text-black dark:text-white"
                amount={order.cost.totalAmount.amount}
                currencyCode={order.cost.totalAmount.currencyCode}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("deliveryMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.deliveryOption.label}</p>
              <p className="text-sm text-neutral-500">
                {order.deliveryOption.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("paymentMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.paymentOption.label}</p>
              <p className="text-sm text-neutral-500">
                {order.paymentOption.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </Container>
  );
}
