"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useT } from "lib/i18n/messages-context";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search({ actionPath = "/search" }: { actionPath?: string }) {
  const searchParams = useSearchParams();
  const t = useT("common");

  return (
    <Form
      action={actionPath}
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder={t("searchPlaceholder")}
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="text-md w-full rounded-control border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  const t = useT("common");

  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-control border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
