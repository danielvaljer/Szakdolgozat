import { ComingSoon } from "@/components/ui/coming-soon";
import { t } from "@/lib/i18n/hu";

export default function LoansPage() {
  return (
    <ComingSoon
      title={`${t.nav.kiadas} / ${t.nav.visszavetel}`}
      phase="Novemberi szakasz – kiadás-visszavétel és naplózás"
      points={[
        "Egy folyamatban több ruha kiadása egy tagnak, kód beolvasásával vagy kereséssel.",
        "Visszavételkor állapot rögzítése, sérülés megjegyzéssel.",
        "Minden művelet bekerül a naplóba (ki, mikor, mit, előtte/utána).",
        "Lejárt határidők kiemelése és a ruhák aktuális státuszának követése.",
      ]}
    />
  );
}
