import OpengraphImage from "components/opengraph-image";
import { getPage, getStoreCode } from "lib/api";

export default async function Image({ params }: { params: { page: string } }) {
  const storeCode = await getStoreCode();
  const page = await getPage(storeCode, params.page);
  const title = page.seo?.title || page.title;

  return await OpengraphImage({ title });
}
