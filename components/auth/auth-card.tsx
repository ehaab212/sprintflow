import React from 'react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            SF
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">
            Sprint<span className="text-primary">Flow</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          {subtitle}
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="relative rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        {children}
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {footerText}{' '}
        <Link
          href={footerLinkHref}
          className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline transition-colors"
        >
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
