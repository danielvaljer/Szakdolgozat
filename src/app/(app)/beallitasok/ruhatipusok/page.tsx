import { ComingSoon } from "@/components/ui/coming-soon";
import { t } from "@/lib/i18n/hu";

export default function GarmentTypesPage() {
  return (
    <ComingSoon
      title={t.nav.ruhatipusok}
      phase="Október vége – törzsadatok kezelése (adminisztrátor)"
      points={[
        "Ruhatípusok listája, új típus felvétele és átnevezése.",
        "A típus kódja (pl. ING) adja az egyedi azonosító előtagját.",
        "Törlés helyett deaktiválás: a régi ruhák és a napló hivatkoznak rá.",
        "Ugyanez a minta a tájegységeknél is.",
      ]}
    />
  );
}
