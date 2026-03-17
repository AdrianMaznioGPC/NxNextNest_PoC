import { ResolvedPageRendererV2 } from "components/page-renderer/resolved-page-renderer-v2";
import { getRequestBootstrap } from "lib/bootstrap";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type DynamicPageProps = {
  params: Promise<{ page?: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  _props: DynamicPageProps,
): Promise<Metadata> {
  const bootstrap = await getRequestBootstrap();
  const page = bootstrap.page;
  if (!page || page.status === 404 || page.status === 301) return {};

  return {
    title: page.seo.title,
    description: page.seo.description,
    robots: page.seo.robots,
    openGraph: page.seo.openGraph,
    alternates: page.alternates
      ? {
          canonical: page.canonicalUrl,
          languages: page.alternates,
        }
      : undefined,
  };
}

export default async function Page(_props: DynamicPageProps) {
  const bootstrap = await getRequestBootstrap();
  const page = bootstrap.page;
  if (!page) return notFound();
  if (page.status === 301 && page.redirectTo) {
    redirect(page.redirectTo);
  }
  if (page.status === 404) return notFound();
  // console.log({experience: bootstrap?.shell})
  return (
    <>
      {page.seo.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(page.seo.jsonLd),
          }}
        />
      ) : null}
      <ResolvedPageRendererV2 slots={bootstrap.slots} />
    </>
  );
}
