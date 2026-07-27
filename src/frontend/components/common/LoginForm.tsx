"use client";

import { useState } from "react";
import { TextInput, FormField } from "@/frontend/components/common/FormField";
import { Button } from "@/frontend/components/common/Button";
import { loginUser, registerUser } from "@/frontend/lib/api";

interface LoginFormProps {
  mode?: "login" | "signup";
}

export function LoginForm({ mode = "login" }: LoginFormProps) {
  const [formMode, setFormMode] = useState<"login" | "signup">(mode);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      name: String(formData.get("name") || ""),
      college: String(formData.get("college") || ""),
      role: formMode === "signup" ? "STUDENT" : undefined,
    };

    setIsSubmitting(true);
    setStatus(null);

    try {
      if (formMode === "signup") {
        await registerUser({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          college: payload.college,
          role: payload.role,
        });
        setStatus("Account created successfully.");
      } else {
        await loginUser({ email: payload.email, password: payload.password });
        setStatus("Logged in successfully.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
      {formMode === "signup" && (
        <>
          <FormField label="Full name" htmlFor="name">
            <TextInput id="name" name="name" type="text" placeholder="Jane Doe" required />
          </FormField>
          <FormField label="College" htmlFor="college">
            <TextInput id="college" name="college" type="text" placeholder="University Name" required />
          </FormField>
        </>
      )}

      <FormField label="College email" htmlFor="email">
        <TextInput id="email" name="email" type="email" placeholder="you@university.edu" required />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <TextInput id="password" name="password" type="password" placeholder="••••••••" required />
      </FormField>

      {status && <p className="text-sm text-stone-charcoal">{status}</p>}

      <Button type="submit" variant="primary" fullWidth className="mt-2 py-4" disabled={isSubmitting}>
        {isSubmitting ? "Working..." : formMode === "signup" ? "Create account" : "Log in"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        fullWidth
        className="py-2"
        onClick={() => setFormMode(formMode === "login" ? "signup" : "login")}
      >
        {formMode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
      </Button>
    </form>
  );
}
