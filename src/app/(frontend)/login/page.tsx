"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { AuthTabs } from "@/frontend/components/common/AuthTabs";
import { LoginForm } from "@/frontend/components/common/LoginForm";
import { Button } from "@/frontend/components/common/Button";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mint-wash font-sans antialiased">
      <header className="fixed top-0 z-50 flex h-[72px] w-full items-center justify-center bg-transparent">
        <Link href="/" className="font-display text-heading-sm italic tracking-tight text-stone-charcoal">
          stuCart
        </Link>
      </header>

      <main className="mb-8 mt-[72px] w-full max-w-[420px] px-container-margin">
        <FadeInSection
          as="div"
          stagger
          className="flex w-full flex-col gap-6 rounded-2xl bg-cream-paper p-card-padding shadow-ambient"
        >
          <StaggerItem className="flex flex-col items-center justify-center space-y-2 text-center">
            <h2 className="font-display text-heading font-light italic text-stone-charcoal">
              stuCart
            </h2>
            <p className="font-body-sm text-sage-gray">
              Buy, sell, and exchange with fellow students
            </p>
          </StaggerItem>

          <StaggerItem>
            <AuthTabs onChange={(tab) => setMode(tab === "Sign up" ? "signup" : "login")} />
          </StaggerItem>

          <StaggerItem>
            <LoginForm mode={mode} />
          </StaggerItem>

          <StaggerItem className="mt-[-8px] text-center">
            <a href="#" className="text-[13px] text-stone-charcoal underline transition-colors hover:text-primary">
              Forgot password?
            </a>
          </StaggerItem>

          <StaggerItem className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-surface-variant" />
            <span className="text-[13px] text-sage-gray">or</span>
            <div className="h-px flex-1 bg-surface-variant" />
          </StaggerItem>

          <StaggerItem>
            <Button variant="outline" fullWidth className="border-stone-charcoal py-[14px] text-stone-charcoal">
              Continue with college SSO
            </Button>
          </StaggerItem>
        </FadeInSection>

        <div className="mt-6 w-full text-center">
          <p className="font-caption text-sage-gray">By continuing you agree to our Terms</p>
        </div>
      </main>
    </div>
  );
}
