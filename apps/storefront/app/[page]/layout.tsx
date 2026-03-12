import Container from "components/layout/container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Container className="max-w-2xl py-20">{children}</Container>;
}
