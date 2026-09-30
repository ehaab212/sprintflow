import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create an Account | SprintFlow',
  description: 'Join SprintFlow to plan, track, and ship high-velocity software sprints',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start managing your agile projects with SprintFlow"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <Suspense
        fallback={
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
