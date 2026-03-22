export default function CheckoutHeaderSlot({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8 space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
    </header>
  );
}
