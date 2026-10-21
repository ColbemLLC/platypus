import type { ReactNode } from "react";

export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-divider ${className}`} />;
}

export function ViewMain({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`min-w-0 flex-1 overflow-y-auto ${className}`}>{children}</main>;
}

export function ViewSection({
  title,
  children,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">{title}</h2>
      <Divider className="my-3" />
      {children}
    </section>
  );
}

export function ViewCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-border bg-background p-5 ${className}`}>{children}</div>;
}