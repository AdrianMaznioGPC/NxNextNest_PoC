import clsx from "clsx";

export default function LogoSquare({
  size,
  storeFlagIconSrc,
  storeFlagIconLabel,
}: {
  size?: "sm" | undefined;
  storeFlagIconSrc: string;
  storeFlagIconLabel: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center overflow-hidden border border-logo-shell-border bg-logo-shell",
        {
          "h-[40px] w-[40px] rounded-md": !size,
          "h-[30px] w-[30px] rounded-md": size === "sm",
        },
      )}
    >
      <img
        alt={`${storeFlagIconLabel} flag`}
        src={storeFlagIconSrc}
        loading="eager"
        decoding="async"
        className="h-full w-full rounded-[inherit] object-cover"
      />
    </div>
  );
}
