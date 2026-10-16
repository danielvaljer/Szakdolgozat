import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { DueDate } from "@/components/ui/due-date";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { garmentsForMember, garmentTypeName, members, regionName } from "@/lib/mock/data";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((item) => item.id === id);

  if (!member) {
    notFound();
  }

  const owned = garmentsForMember(member.id);

  return (
    <>
      <PageHeader
        title={member.name}
        description={`${member.id} · ${t.members.since}: ${formatDate(member.memberSince)}`}
        action={
          <Link href="/tagok" className={buttonClass("ghost")}>
            {t.common.back}
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader title={t.columns.name} action={<Badge tone={member.active ? "success" : "neutral"}>{member.active ? t.members.activeYes : t.members.activeNo}</Badge>} />
          <CardBody>
            <dl className="text-sm">
              <div className="flex justify-between gap-4 border-b border-line py-2">
                <dt className="text-ink-muted">{t.auth.email}</dt>
                <dd className="text-ink">{member.email}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2">
                <dt className="text-ink-muted">Telefon</dt>
                <dd className="tabular-nums text-ink">{member.phone}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Azonosító</dt>
                <dd className="tabular-nums text-ink">{member.id}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t.members.owns}
            description={`${owned.length} ${t.common.results}`}
          />
          {owned.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-muted">{t.dashboard.noRecentLoans}</p>
            </CardBody>
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th>{t.columns.code}</Th>
                  <Th>{t.columns.type}</Th>
                  <Th>{t.columns.due}</Th>
                  <Th>{t.columns.status}</Th>
                </Tr>
              </THead>
              <TBody>
                {owned.map((garment) => (
                  <Tr key={garment.inventoryCode} className="hover:bg-surface-muted">
                    <Td>
                      <Link
                        href={`/ruhak/${garment.inventoryCode}`}
                        className="font-medium tabular-nums hover:text-accent"
                      >
                        {garment.inventoryCode}
                      </Link>
                    </Td>
                    <Td>
                      {garmentTypeName(garment.typeCode)} · {regionName(garment.regionSlug)}
                    </Td>
                    <Td className="text-ink-muted">
                      <DueDate value={garment.dueAt} />
                    </Td>
                    <Td>
                      <StatusBadge status={garment.status} dueAt={garment.dueAt} />
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
}
