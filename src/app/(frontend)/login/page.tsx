"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PillInput } from '../../../frontend/components/PillInput';
import { PillButton } from '../../../frontend/components/PillButton';
import { loginUser } from '@/frontend/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await loginUser({ email, password });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-[420px] mx-auto mt-20 relative">
      <Link href="/" className="absolute -top-10 left-0 text-[13px] font-medium text-sage-gray hover:text-stone-charcoal transition-colors">
        &larr; Back to home
      </Link>
      <div className="bg-cream-paper rounded-[24px] p-[30px] whisper-shadow flex flex-col items-center">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="font-display italic text-[30px] font-[300] text-stone-charcoal tracking-tight">stuCart</h1>
          </Link>
          <p className="font-body-sm text-sage-gray mt-1">Welcome back</p>
        </header>

        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}
          
          <PillInput
            label="College email"
            type="email"
            placeholder="yourname@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PillInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-center">
            <Link 
              href="/forgot-password" 
              className="text-[13px] font-medium text-stone-charcoal underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Forgot password?
            </Link>
          </div>

          <PillButton type="submit" variant="primary" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </PillButton>
        </form>

        <div className="w-full flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-silver-border/40"></div>
          <span className="font-body-sm text-sage-gray italic">or</span>
          <div className="flex-1 h-[1px] bg-silver-border/40"></div>
        </div>

        <PillButton type="button" variant="ghost" className="w-full gap-2">
          Continue with college SSO
        </PillButton>

        <footer className="mt-10 mb-2">
          <Link 
            href="/signup"
            className="text-[13px] font-medium text-stone-charcoal underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            New here? Create an account
          </Link>
        </footer>
      </div>

      <div className="mt-12 opacity-30 flex justify-center gap-8 text-sage-gray">
        <span className="material-symbols-outlined text-[20px]">school</span>
        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
        <span className="material-symbols-outlined text-[20px]">eco</span>
      </div>
    </main>
  );
}
