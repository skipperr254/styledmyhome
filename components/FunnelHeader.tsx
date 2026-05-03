import Link from "next/link";
import Image from "next/image";
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
          <Image
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            width={180}
            height={72}
            className="h-12 w-auto"
            priority
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
