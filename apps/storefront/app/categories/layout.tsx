import { Container } from "@commerce/ui";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container>{children}</Container>;
}
