import { Container, Skeleton } from "@commerce/ui";

export default function CheckoutLoading() {
  return (
    <Container>
      <Skeleton className="mb-8 h-9 w-40 rounded" />
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="space-y-8 lg:col-span-7">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    </Container>
  );
}
