'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { registerUser } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });


  // Password rules validation for live visual indicators
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // 1. Call server action to register user
      const result = await registerUser(data);

      if (!result.success) {
        setAuthError(result.error || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      // 2. Automatically sign in with the new credentials
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded, but auto-login failed: redirect to login page
        router.push('/login?registered=true');
        return;
      }

      // 3. Success: redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Registration submission error:', err);
      setAuthError('An unexpected error occurred during registration. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {authError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="name"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            placeholder="Sarah Connor"
            className={`w-full rounded-lg bg-background/80 border ${
              errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            } h-11 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50`}
            {...register('name')}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Work Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            placeholder="sarah@company.com"
            className={`w-full rounded-lg bg-background/80 border ${
              errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            } h-11 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="••••••••"
            className={`w-full rounded-lg bg-background/80 border ${
              errors.password ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            } h-11 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.password.message}
          </p>
        )}

        {/* Live Password Requirements Checklist */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-xs text-muted-foreground">
          <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-green-500 font-medium' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" /> 8+ characters
          </span>
          <span className={`flex items-center gap-1.5 ${hasUppercase ? 'text-green-500 font-medium' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" /> 1 uppercase
          </span>
          <span className={`flex items-center gap-1.5 ${hasLowercase ? 'text-green-500 font-medium' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" /> 1 lowercase
          </span>
          <span className={`flex items-center gap-1.5 ${hasNumber ? 'text-green-500 font-medium' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" /> 1 number
          </span>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            placeholder="••••••••"
            className={`w-full rounded-lg bg-background/80 border ${
              errors.confirmPassword ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            } h-11 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50`}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-lg font-medium text-sm mt-2 transition-all duration-200"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </span>
        ) : (
          'Create SprintFlow Account'
        )}
      </Button>
    </form>
  );
}
