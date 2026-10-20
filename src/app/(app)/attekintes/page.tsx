import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/card";
import { IconPlus, IconScan, IconSwap } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { DueDate } from "@/components/ui/due-date";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";
import { daysUntil, formatNumber } from "@/lib/format";
import { t } from "@/lib/i18n/hu";
import { garmentStats, garments, recentLoans } from "@/lib/mock-data";

export default function DashboardPage() {
  const stats = garmentStats(garments);
  const loans = recentLoans(5);

  return (
    <>
      <PageHeader title={t.dashboard.title} description={t.dashboard.subtitle} />

      <p className="mb-4 rounded-md border border-line bg-surface-muted px-3 py-2 text-xs text-ink-muted">
        {t.app.demoNotice}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t.dashboard.total} value={formatNumber(stats.total)} />
        <StatCard
          label={t.dashboard.loaned}
          value={formatNumber(stats.loaned + stats.overdue)}
          valueClassName="text-info"
        />
        <StatCard
          label={t.dashboard.overdue}
          value={formatNumber(stats.overdue)}
          valueClassName={stats.overdue > 0 ? "text-warning" : undefined}
        />
        <StatCard label={t.dashboard.repair} value={formatNumber(stats.repair)} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader
            title={t.dashboard.recentLoans}
            action={
              <Link href="/ruhak?statusz=kiadva&rendez=hatarido" className={buttonClass("ghost", "sm")}>
                {t.nav.ruhak}
              </Link>
            }
          />
          {loans.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-muted">{t.dashboard.noRecentLoans}</p>
            </CardBody>
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th>{t.columns.code}</Th>
                  <Th>{t.columns.member}</Th>
                  <Th>{t.columns.due}</Th>
                  <Th>{t.columns.status}</Th>
                </Tr>
              </THead>
              <TBody>
                {loans.map((loan) => {
                  const remaining = loan.dueAt ? daysUntil(loan.dueAt) : null;
                  return (
                    <Tr key={loan.id}>
                      <Td>
                        <Link
                          href={`/ruhak/${loan.inventoryCode}`}
                          className="font-medium tabular-nums text-ink hover:text-accent"
                        >
                          {loan.inventoryCode}
                        </Link>
                      </Td>
                      <Td>{loan.memberName}</Td>
                      <Td>
                        <DueDate value={loan.dueAt} />
                      </Td>
                      <Td>
                        <StatusBadge
                          status={remaining !== null && remaining < 0 ? "overdue" : "loaned"}
                          dueAt={loan.dueAt}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
          )}
        </Card>

        <Card>
          <CardHeader title={t.dashboard.quickActions} />
          <CardBody className="flex flex-col gap-2">
            <Link href="/ruhak/uj" className={buttonClass("primary", "md", "justify-start")}>
              <IconPlus width={18} height={18} />
              {t.dashboard.newGarment}
            </Link>
            <Link href="/kiadas" className={buttonClass("secondary", "md", "justify-start")}>
              <IconSwap width={18} height={18} />
              {t.dashboard.newLoan}
            </Link>
            <Link href="/kiadas" className={buttonClass("secondary", "md", "justify-start")}>
              <IconScan width={18} height={18} />
              {t.dashboard.scan}
            </Link>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
