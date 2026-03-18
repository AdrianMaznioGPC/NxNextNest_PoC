import { IconButton } from "@commerce/ui";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function OpenCart({
  className,
  quantity,
  onClick,
  ...props
}: {
  className?: string;
  quantity?: number;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <IconButton
      size="lg"
      variant="default"
      className={className}
      onClick={onClick}
      {...props}
    >
      <ShoppingCartIcon className="h-4 transition-all ease-in-out hover:scale-110" />
      {quantity ? (
        <span className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-primary text-[11px] font-medium text-primary-foreground">
          {quantity}
        </span>
      ) : null}
    </IconButton>
  );
}
