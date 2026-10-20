import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/form";
import { IconSearch } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { garmentsForMember, members } from "@/lib/mock-data";
import { fold, type RawSearchParams } from "@/lib/query";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const search = (Array.isArray(raw) ? raw[0] ?? "" : raw ?? "").trim();
  const needle = fold(search);

  const rows = members.filter((member) =>
    needle ? fold(`${member.name} ${member.email} ${member.id}`).includes(needle) : true,
  );

  return (
    <>
      <PageHeader
        title={t.members.title}
        description={`${formatNumber(rows.length)} ${t.common.results} · ${t.members.subtitle}`}
      />

      <form action="/tagok" method="get" className="rounded-md border border-line bg-surface p-3">
        <div className="relative max-w-[420px]">
          <IconSearch
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
            width={16}
            height={16}
          />
          <Input
            id="q"
            name="q"
            defaultValue={search}
            placeholder="Név, e-mail vagy azonosító"
            className="pl-9"
            aria-label={t.common.search}
          />
        </div>
      </form>

      <div className="mt-3 overflow-hidden rounded-md border border-line bg-surface">
        <Table>
          <THead>
            <Tr>
              <Th>{t.columns.name}</Th>
              <Th className="hidden sm:table-cell">{t.columns.contact}</Th>
              <Th className="hidden md:table-cell">{t.members.since}</Th>
              <Th>{t.columns.active}</Th>
              <Th className="text-right">{t.members.owns}</Th>
            </Tr>
          </THead>
          <TBody>
            {rows.map((member) => (
              <Tr key={member.id} className="hover:bg-surface-muted">
                <Td>
                  <Link href={`/tagok/${member.id}`} className="font-medium hover:text-accent">
                    {member.name}
                  </Link>
                  <span className="ml-2 text-xs tabular-nums text-ink-muted">{member.id}</span>
                </Td>
                <Td className="hidden text-ink-muted sm:table-cell">
                  <span className="block text-xs">{member.email}</span>
                  <span className="block text-xs tabular-nums">{member.phone}</span>
                </Td>
                <Td className="hidden tabular-nums text-ink-muted md:table-cell">
                  {formatDate(member.memberSince)}
                </Td>
                <Td>
                  <Badge tone={member.active ? "success" : "neutral"}>
                    {member.active ? t.members.activeYes : t.members.activeNo}
                  </Badge>
                </Td>
                <Td className="text-right tabular-nums">
                  {formatNumber(garmentsForMember(member.id).length)}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </>
  );
}
