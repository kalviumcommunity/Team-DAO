"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PillInput } from '../../../frontend/components/PillInput';
import { PillButton } from '../../../frontend/components/PillButton';
import { registerUser } from '@/frontend/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser({ name: fullName, college, email, password });
      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 md:p-12">
      <main className="w-full max-w-[1100px] min-h-[700px] bg-cream-paper rounded-[24px] overflow-hidden whisper-shadow grid md:grid-cols-2">
        
        {/* Left Column: Branding Hero */}
        <div className="p-12 flex flex-col bg-surface-container-low/30 md:border-r border-silver-border/20">
          <div className="mb-12">
            <h1 className="font-display text-[48px] font-[300] text-stone-charcoal leading-tight mb-4">
              Join stuCart
            </h1>
            <p className="font-subheading text-subheading text-on-surface-variant max-w-sm">
              Buy, sell, and exchange with students on your campus
            </p>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full h-full max-h-[500px] flex items-center justify-center relative">
              {/* TODO: Add signup-books.jpg to public/images/ */}
              <Image 
                src="/images/signup-books.jpg" 
                alt="A stack of vintage hardcover books" 
                fill
                className="object-contain hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-[400px] mx-auto w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm text-center mb-4">{error}</div>
              )}

              <PillInput
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <PillInput
                type="text"
                placeholder="College/University Name"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />

              <PillInput
                type="email"
                placeholder="College email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PillInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <PillInput
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <PillButton type="submit" variant="primary" disabled={isSubmitting} className="w-full mt-4">
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </PillButton>
            </form>

            <div className="mt-8 text-center">
              <Link 
                href="/login" 
                className="text-[14px] font-body-sm text-stone-charcoal underline underline-offset-4 decoration-stone-charcoal/30 hover:decoration-stone-charcoal transition-colors"
              >
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-6 w-full text-center pointer-events-none">
        <p className="font-label-caps text-[10px] text-sage-gray uppercase opacity-60 tracking-[0.25em]">
          © 2026 stuCart
        </p>
      </footer>
    </div>
  );
}
