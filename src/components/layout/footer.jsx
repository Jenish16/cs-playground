import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>Computer Science Playground — learn by interacting.</p>
        <p>Built for learning. No tracking, no accounts.</p>
      </Container>
    </footer>
  );
}
