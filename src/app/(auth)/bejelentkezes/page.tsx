import { Button } from "@/components/ui/button";
import { FormRow, Input } from "@/components/ui/field";
import { BrandMark } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { t } from "@/lib/i18n/hu";

/** Bejelentkezés: saját elrendezés, váz nélkül (route group: (auth)). */
export default function LoginPage() {
  return (
    <div className="grid min-h-svh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-8" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">{t.app.name}</p>
              <p className="text-xs text-ink-muted">{t.app.tagline}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <form className="rounded-md border border-line bg-surface p-5">
          <h1 className="text-lg font-semibold text-ink">{t.auth.title}</h1>
          <p className="mt-0.5 text-sm text-ink-muted">{t.auth.subtitle}</p>

          <div className="mt-4 flex flex-col gap-3">
            <FormRow label={t.auth.email} htmlFor="email">
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="nev@example.hu" />
            </FormRow>
            <FormRow label={t.auth.password} htmlFor="password">
              <Input id="password" name="password" type="password" autoComplete="current-password" />
            </FormRow>
          </div>

          <Button type="submit" className="mt-4 w-full">
            {t.auth.submit}
          </Button>

          <p className="mt-3 text-xs text-ink-muted">{t.auth.forgot}</p>
          <p className="mt-1 text-xs text-ink-muted">{t.auth.noAccount}</p>
        </form>

        <p className="mt-3 text-xs text-ink-muted">{t.app.demoNotice}</p>
      </div>
    </div>
  );
}
