import Link from "next/link";
import { ReactNode } from "react";

export function FunnelHeader({
  rightContent,
  bottomContent,
}: {
  rightContent?: ReactNode;
  bottomContent?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-ink/10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/">
          <img
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            className="h-12 w-auto"
          />
        </Link>
        {rightContent}
      </div>
      {bottomContent && (
        <div className="max-w-5xl mx-auto px-6 pb-4">{bottomContent}</div>
      )}
    </header>
  );
}
