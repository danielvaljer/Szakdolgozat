import { ComingSoon } from "@/components/ui/coming-soon";
import { t } from "@/lib/i18n/hu";

export default function LogPage() {
  return (
    <ComingSoon
      title={t.nav.naplo}
      phase="Novemberi szakasz – teljes műveleti naplózás"
      points={[
        "Minden írási művelet naplózva: ki, mikor, mit, milyen értékről milyenre.",
        "Szűrés műveletre, felhasználóra, tárgyra (pl. egy ruha teljes története) és dátumra.",
        "Egy naplóbejegyzésnél az előtte/utána állapot összevetése.",
        "A napló nem módosítható és nem törölhető – ez a rendszer bizonyítéka.",
      ]}
    />
  );
}
