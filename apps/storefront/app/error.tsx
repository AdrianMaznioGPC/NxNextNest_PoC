"use client";

import { Button, Card, CardContent } from "@commerce/ui";
import { useTranslations } from "next-intl";

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations("error");

  return (
    <Card className="mx-auto my-4 max-w-xl p-8 md:p-12">
      <CardContent className="p-0">
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <p className="my-2">{t("description")}</p>
        <Button className="mt-4 w-full rounded-full" onClick={() => reset()}>
          {t("tryAgain")}
        </Button>
      </CardContent>
    </Card>
  );
}
