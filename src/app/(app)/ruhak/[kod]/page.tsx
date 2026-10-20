import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ConditionBadge, StatusBadge } from "@/components/ui/badge";
import { DueDate } from "@/components/ui/due-date";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { findGarment, garmentTypeName, loansForGarment, regionName } from "@/lib/mock-data";

function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 last:border-b-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-sm font-medium text-ink">{children}</dd>
    </div>
  );
}

export default async function GarmentDetailPage({
  params,
}: {
  params: Promise<{ kod: string }>;
}) {
  const { kod } = await params;
  const garment = findGarment(kod);

  if (!garment) {
    notFound();
  }

  const history = loansForGarment(garment.inventoryCode);
  const isLoaned = garment.status === "loaned" || garment.status === "overdue";

  return (
    <>
      <PageHeader
        title={garment.inventoryCode}
        description={`${garmentTypeName(garment.typeCode)} · ${regionName(garment.regionSlug)}`}
        action={
          <>
            <Link href="/ruhak" className={buttonClass("ghost")}>
              {t.common.back}
            </Link>
            <Link href={`/ruhak/${garment.inventoryCode}/szerkesztes`} className={buttonClass("secondary")}>
              {t.common.save}
            </Link>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title={t.garments.detailTitle}
              action={<StatusBadge status={garment.status} loanedTo={garment.loanedTo} dueAt={garment.dueAt} />}
            />
            <CardBody>
              <dl>
                <DataRow label={t.columns.type}>{garmentTypeName(garment.typeCode)}</DataRow>
                <DataRow label={t.columns.region}>{regionName(garment.regionSlug)}</DataRow>
                <DataRow label={t.columns.size}>{garment.size}</DataRow>
                <DataRow label={t.columns.color}>{garment.color}</DataRow>
                <DataRow label={t.columns.condition}>
                  <ConditionBadge condition={garment.condition} />
                </DataRow>
                <DataRow label={t.columns.value}>{formatCurrency(garment.value)}</DataRow>
                <DataRow label="Felvéve">{formatDate(garment.createdAt)}</DataRow>
                <DataRow label="Megjegyzés">{garment.notes ?? "–"}</DataRow>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t.garments.loanHistory} />
            {history.length === 0 ? (
              <CardBody>
                <p className="text-sm text-ink-muted">{t.garments.noLoanHistory}</p>
              </CardBody>
            ) : (
              <Table>
                <THead>
                  <Tr>
                    <Th>{t.columns.member}</Th>
                    <Th>Kiadva</Th>
                    <Th>{t.columns.due}</Th>
                  </Tr>
                </THead>
                <TBody>
                  {history.map((loan) => (
                    <Tr key={loan.id}>
                      <Td>{loan.memberName}</Td>
                      <Td className="tabular-nums">{formatDate(loan.loanedAt)}</Td>
                      <Td className="tabular-nums">{formatDate(loan.dueAt)}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {isLoaned ? (
            <Card className="border-info">
              <CardBody>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  {t.garments.currentlyLoanedTo}
                </p>
                <p className="mt-1 text-base font-semibold text-ink">{garment.loanedTo}</p>
                <p className="text-sm text-ink-muted">
                  {t.columns.due}: <DueDate value={garment.dueAt} />
                </p>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader title={t.garments.images} />
            <CardBody className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="grid aspect-square place-items-center rounded-sm border border-dashed border-line text-xs text-ink-muted"
                >
                  {slot === 0 ? "fő kép" : "kép"}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t.common.actions} />
            <CardBody className="flex flex-col gap-2">
              <Link href="/kiadas" className={buttonClass("primary", "md", "justify-start")}>
                {t.dashboard.newLoan}
              </Link>
              <Link href={`/naplo?targy=${garment.inventoryCode}`} className={buttonClass("ghost", "md", "justify-start")}>
                {t.nav.naplo}
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
