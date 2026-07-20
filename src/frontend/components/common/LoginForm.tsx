"use client";

import { TextInput, FormField } from "@/frontend/components/common/FormField";
import { Button } from "@/frontend/components/common/Button";

export function LoginForm() {
  return (
    <form className="flex w-full flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
      <FormField label="College email" htmlFor="email">
        <TextInput id="email" type="email" placeholder="you@university.edu" required />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <TextInput id="password" type="password" placeholder="••••••••" required />
      </FormField>

      <Button type="submit" variant="primary" fullWidth className="mt-2 py-4">
        Log in
      </Button>
    </form>
  );
}
