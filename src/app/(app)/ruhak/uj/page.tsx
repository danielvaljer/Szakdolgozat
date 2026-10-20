import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FormRow, Input, Select, Textarea } from "@/components/ui/form";
import { IconPlus } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n/hu";
import { allSizes, garmentTypes, garments, regions } from "@/lib/mock-data";

function nextCode(typeCode: string): string {
  const used = garments.filter((garment) => garment.typeCode === typeCode).length;
  return `${typeCode}-${String(used + 1).padStart(4, "0")}`;
}

export default function NewGarmentPage() {
  return (
    <>
      <PageHeader
        title={t.garments.newTitle}
        description={t.garments.newSubtitle}
        action={
          <Link href="/ruhak" className={buttonClass("ghost")}>
            {t.common.back}
          </Link>
        }
      />

      <form className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader title={t.columns.type} description={t.garments.newSubtitle} />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <FormRow label={t.columns.type} htmlFor="typeCode">
              <Select id="typeCode" name="typeCode" defaultValue="ING">
                {garmentTypes.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label={t.columns.region} htmlFor="regionSlug">
              <Select id="regionSlug" name="regionSlug" defaultValue="paloc">
                {regions.map((region) => (
                  <option key={region.slug} value={region.slug}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label={t.columns.size} htmlFor="size">
              <Select id="size" name="size" defaultValue="M">
                {allSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label={t.columns.color} htmlFor="color">
              <Input id="color" name="color" defaultValue="Piros" />
            </FormRow>

            <FormRow label={t.columns.condition} htmlFor="condition">
              <Select id="condition" name="condition" defaultValue="good">
                <option value="new">{t.condition.new}</option>
                <option value="good">{t.condition.good}</option>
                <option value="worn">{t.condition.worn}</option>
                <option value="damaged">{t.condition.damaged}</option>
              </Select>
            </FormRow>

            <FormRow label={t.columns.value} htmlFor="value" hint="Forintban, becsült érték">
              <Input id="value" name="value" type="number" min={0} step={500} defaultValue={25000} />
            </FormRow>

            <FormRow label="Megjegyzés" htmlFor="notes" className="sm:col-span-2">
              <Textarea id="notes" name="notes" placeholder="Pl. kézzel hímzett, kis folt a szegélyen…" />
            </FormRow>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={t.garments.images} description={t.garments.imageHint} />
            <CardBody>
              <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-dashed border-line px-4 py-8 text-center">
                <IconPlus className="text-ink-muted" />
                <span className="text-sm text-ink-muted">Fotó kiválasztása</span>
                <span className="text-xs text-ink-muted">JPG vagy PNG, max. 1600 px hosszú él</span>
                <input type="file" accept="image/*" multiple className="hidden" />
              </label>
              <p className="mt-3 rounded-sm bg-surface-muted px-3 py-2 text-xs text-ink-muted">
                {t.garments.suggestType}: <strong className="text-ink">Ing</strong> ·{" "}
                <span className="text-accent">{t.garments.acceptSuggestion}</span>
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t.garments.autoCodeHint} />
            <CardBody>
              <p className="text-2xl font-semibold tabular-nums text-ink">{nextCode("ING")}</p>
              <p className="mt-1 text-xs text-ink-muted">
                A rendszer a típus előtagjából és egy folyamatos sorszámból képzi, és gondoskodik az
                egyediségről (párhuzamos felvitel esetén is).
              </p>
            </CardBody>
          </Card>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className={buttonClass("primary")}>
          {t.common.save}
        </button>
        <Link href="/ruhak" className={buttonClass("secondary")}>
          {t.common.cancel}
        </Link>
        <p className="text-xs text-ink-muted">{t.app.demoNotice}</p>
      </div>
    </>
  );
}
