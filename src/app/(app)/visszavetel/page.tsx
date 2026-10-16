import { ComingSoon } from "@/components/ui/coming-soon";
import { t } from "@/lib/i18n/hu";

export default function ReturnPage() {
  return <ComingSoon {...t.comingSoon.visszavetel} />;
}
