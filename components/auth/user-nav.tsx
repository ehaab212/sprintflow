'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Loader2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserNavProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function UserNav({ user }: UserNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  const displayName = user.name || 'User';
  const displayEmail = user.email || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-3 overflow-hidden min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold">
          {initials || <UserIcon className="h-4 w-4" />}
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
          <span className="truncate text-sm font-medium text-foreground">
            {displayName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {displayEmail}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="Sign Out"
        aria-label="Sign Out"
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
