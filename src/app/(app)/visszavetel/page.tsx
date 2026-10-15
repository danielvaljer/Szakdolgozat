import { ComingSoon } from "@/components/ui/coming-soon";
import { t } from "@/lib/i18n/hu";

export default function ReturnPage() {
  return (
    <ComingSoon
      title={t.nav.visszavetel}
      phase="Novemberi szakasz – kiadás-visszavétel és naplózás"
      points={[
        "A ruha kódjának beolvasása (QR) vagy kézi beírása: mobilon ez a leggyorsabb út.",
        "Visszavételkor a ruha állapotának rögzítése, sérülés esetén megjegyzéssel.",
        "A ruha státusza automatikusan visszaáll kiadhatóra, és a kiadás lezárul.",
        "A napló rögzíti, ki vette vissza és milyen állapotban.",
      ]}
    />
  );
}
