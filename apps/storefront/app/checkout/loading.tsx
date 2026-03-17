import { Container } from "@commerce/ui";

export default function CheckoutLoading() {
  return (
    <Container>
      <div className="mb-8 h-9 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="space-y-8 lg:col-span-7">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            />
          ))}
        </div>
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <div className="h-96 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" />
        </div>
      </div>
    </Container>
  );
}
