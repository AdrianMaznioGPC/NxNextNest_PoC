import Container from "components/layout/container";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container className="py-8">{children}</Container>;
}
