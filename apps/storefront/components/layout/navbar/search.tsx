"use client";

import { Input } from "@commerce/ui";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const t = useTranslations("search");

  return (
    <Form
      action="/search"
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <Input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder={t("placeholder")}
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="rounded-lg"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  const t = useTranslations("search");

  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <Input placeholder={t("placeholder")} className="rounded-lg" disabled />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
