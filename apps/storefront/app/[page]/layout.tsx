import { Container } from "@commerce/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Container className="max-w-2xl">{children}</Container>;
}
