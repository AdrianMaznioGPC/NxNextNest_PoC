import Container from "components/layout/container";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto my-16 flex max-w-xl flex-col items-center rounded-lg border border-neutral-200 bg-white p-8 text-center md:p-12 dark:border-neutral-800 dark:bg-black">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-lg text-neutral-600 dark:text-neutral-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Go to Homepage
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-black hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            Search Products
          </Link>
        </div>
      </div>
    </Container>
  );
}
