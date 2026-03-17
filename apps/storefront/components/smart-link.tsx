import Link from "next/link";
import type { ComponentProps } from "react";

type PrefetchIntent = "shell" | "content";
const CONSERVATIVE_PREFETCH =
  process.env.NEXT_PUBLIC_CONSERVATIVE_PREFETCH !== "false";

type SmartLinkProps = ComponentProps<typeof Link> & {
  intent?: PrefetchIntent;
};

export default function SmartLink({
  intent = "content",
  prefetch,
  ...rest
}: SmartLinkProps) {
  const resolvedPrefetch =
    prefetch !== undefined
      ? prefetch
      : CONSERVATIVE_PREFETCH
        ? intent === "shell"
        : undefined;
  return <Link {...rest} prefetch={resolvedPrefetch} />;
}
