import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FormRow, Input, Select, Textarea } from "@/components/ui/form";
import { PageHeader } from "@/components/ui/page-header";
import { t } from "@/lib/i18n/hu";
import { allSizes, findGarment, garmentTypeName, garmentTypes, regions } from "@/lib/mock/data";

export default async function EditGarmentPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const garment = findGarment(kod);

  if (!garment) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`${garment.inventoryCode} – szerkesztés`}
        description={`${garmentTypeName(garment.typeCode)} · ${t.garments.detailTitle}`}
        action={
          <Link href={`/ruhak/${garment.inventoryCode}`} className={buttonClass("ghost")}>
            {t.common.back}
          </Link>
        }
      />

      <form className="max-w-[760px]">
        <Card>
          <CardHeader title={t.garments.autoCodeHint} description="Az azonosító nem módosítható." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <FormRow label={t.columns.type} htmlFor="typeCode">
              <Select id="typeCode" name="typeCode" defaultValue={garment.typeCode}>
                {garmentTypes.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label={t.columns.region} htmlFor="regionSlug">
              <Select id="regionSlug" name="regionSlug" defaultValue={garment.regionSlug}>
                {regions.map((region) => (
                  <option key={region.slug} value={region.slug}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label={t.columns.size} htmlFor="size">
              <Select id="size" name="size" defaultValue={garment.size}>
                {allSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label={t.columns.color} htmlFor="color">
              <Input id="color" name="color" defaultValue={garment.color} />
            </FormRow>

            <FormRow label={t.columns.condition} htmlFor="condition">
              <Select id="condition" name="condition" defaultValue={garment.condition}>
                <option value="new">{t.condition.new}</option>
                <option value="good">{t.condition.good}</option>
                <option value="worn">{t.condition.worn}</option>
                <option value="damaged">{t.condition.damaged}</option>
              </Select>
            </FormRow>

            <FormRow label={t.columns.value} htmlFor="value">
              <Input id="value" name="value" type="number" min={0} step={500} defaultValue={garment.value} />
            </FormRow>

            <FormRow label="Megjegyzés" htmlFor="notes" className="sm:col-span-2">
              <Textarea id="notes" name="notes" defaultValue={garment.notes ?? ""} />
            </FormRow>
          </CardBody>
        </Card>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="button">{t.common.save}</Button>
          <Link href={`/ruhak/${garment.inventoryCode}`} className={buttonClass("secondary")}>
            {t.common.cancel}
          </Link>
          <p className="text-xs text-ink-muted">{t.app.demoNotice}</p>
        </div>
      </form>
    </>
  );
}
