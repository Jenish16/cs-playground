"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Binary } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dsa", label: "DSA" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container as="nav" className="flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Binary className="size-4" />
          </span>
          <span>CS Playground</span>
        </Link>

        <ul className="flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(pathname, link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </header>
  );
}
