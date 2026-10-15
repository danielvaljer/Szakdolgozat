import { ComingSoon } from "@/components/ui/coming-soon";
import { t } from "@/lib/i18n/hu";

export default function RegionsPage() {
  return (
    <ComingSoon
      title={t.nav.tajegysegek}
      phase="Október vége – törzsadatok kezelése (adminisztrátor)"
      points={[
        "Tájegységek listája (palóc, matyó, kalotaszegi…) és új tájegység felvétele.",
        "A tájegység a ruhák szűrésének egyik fő szempontja, ezért kap saját törzsadatot.",
        "Később ide kapcsolódik a tájegység-javaslat a képfeldolgozásból (december).",
      ]}
    />
  );
}
