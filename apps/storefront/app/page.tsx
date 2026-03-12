import { BlockRenderer } from "components/cms/block-renderer";
import Container from "components/layout/container";
import { getHomePageData } from "lib/api";

export const metadata = {
  description: "High-performance ecommerce store built with Next.js.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const { blocks } = await getHomePageData();

  return (
    <Container>
      <BlockRenderer blocks={blocks} />
    </Container>
  );
}
