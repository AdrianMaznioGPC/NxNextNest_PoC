import SmartLink from "components/smart-link";
import { Menu } from "lib/types";

export function FooterMenuItem({ item }: { item: Menu }) {
  return (
    <li>
      <SmartLink
        href={item.path}
        className="block p-2 text-lg underline-offset-4 hover:text-link-hover hover:underline md:inline-block md:text-sm"
      >
        {item.title}
      </SmartLink>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.title} item={item} />;
        })}
      </ul>
    </nav>
  );
}
