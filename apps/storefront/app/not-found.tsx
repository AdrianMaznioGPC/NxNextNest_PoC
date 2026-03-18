import { buttonVariants, Card, CardContent, Container } from "@commerce/ui";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Container>
      <Card className="mx-auto my-16 max-w-xl text-center">
        <CardContent className="flex flex-col items-center p-8 md:p-12">
          <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            {t("description")}
          </p>
          <div className="flex gap-4">
            <Link href="/" className={buttonVariants({ variant: "default" })}>
              {t("goHome")}
            </Link>
            <Link
              href="/search"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("searchProducts")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
