export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-9 w-40 animate-pulse rounded bg-muted-surface" />
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="space-y-8 lg:col-span-7">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-muted-surface"
            />
          ))}
        </div>
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <div className="h-96 animate-pulse rounded-lg bg-muted-surface" />
        </div>
      </div>
    </div>
  );
}
