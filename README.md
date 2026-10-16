# Ruhaleltár és kölcsönzéskezelő (szakdolgozat)

Néptáncegyesületi ruhakészlet nyilvántartása és kölcsönzése: ruhák, tagok, kiadás–visszavétel, teljes műveleti naplózás, szerepkörök, később gépi tanulás alapú képosztályozás.

**Fejlesztő:** Valjer Dániel · **Konzulens:** Dr. Jánki Zoltán Richárd · **Időszak:** 2026. október – 2027. május
**Állapot:** működő felület-váz (mintaadatokkal) – az adatbázis réteg következik

## Hol mi van – egy tény, egy helyen

| Az egyetlen kérdés | Dokumentum |
| --- | --- |
| Mi ez, hogyan indul, hol mi van? | ez a fájl |
| Hogyan dolgozunk, mi tilos, mikor kész egy feladat? | `AGENTS.md` |
| **Hol van mi a kódban?** (hova nyúlj, ha…) | `src/README.md` |
| **Mit** építünk? (követelmények, képernyők, adatmodell) | `docs/terv.md` |
| **Hogyan** néz ki? (design rendszer) | `docs/design.md` |
| **Miért** így? (döntések indoklással) | `docs/dontesek.md` |
| **Hogyan** készült? (AI napló) | `docs/ai-log.md` |
| A hivatalos ütemterv és funkciólista | `docs/tematerv.md` |

Ha egy tény két helyen is szerepel, az **hiba**: az egyik helyen hivatkozás lesz belőle.

## Indítás

**A leggyorsabb út:** `pnpm dev` → <http://localhost:3000> (ha a függőségek már telepítve vannak).

```bash
pnpm install               # függőségek
pnpm dev                   # fejlesztői szerver → http://localhost:3000
pnpm typecheck             # TypeScript ellenőrzés
pnpm test                  # egységtesztek (Vitest)
pnpm build && pnpm start   # éles build
```

**Előkészület a gépen:** Node.js 24 LTS · `pnpm` · Git. (Docker és Supabase CLI csak az adatbázis réteghez kell, novembertől.)

**Ami most működik:** áttekintés, ruhaállomány listája kereséssel / szűréssel / lapozással / rendezéssel, ruha adatlap és szerkesztő űrlap, tagok listája és adatlapja, bejelentkező képernyő (minta), mobil alsó navigáció, világos és sötét mód. Az adatok **minták** – az adatbázis réteg október végén kapcsolódik be.

## Bemutatási menet (konzultációra)

1. **`/ruhak`** – a lényeg: keresés (próbáld: `melleny` – ékezet nélkül is talál), szűrők (Típus, Tájegység, Státusz), „Szűrők +” panel, rendezés a fejléc kattintásával, lapozás.
2. Figyeld meg: **a szűrők az URL-ben vannak** → a link megosztható, a vissza gomb működik, az oldal újratölthető.
3. **`/ruhak/ING-0001`** – adatlap: adatok, állapot, ki viszi most, kölcsönzési előzmények, műveletek.
4. **Kicsinyítsd az ablakot** (vagy F12 → eszköztár): alsó navigáció, középen „Új ruha”, „Több” fiók.
5. **Sötét mód** a fejléc jobb szélén (világos / sötét / rendszer).
6. **`/naplo`** és **`/kiadas`** – megmutatják, mi következik novemberben (a helyük már megvan a navigációban).

## Technológia

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 + shadcn/ui · PostgreSQL (Supabase) + Drizzle ORM · Supabase Auth + Storage · Vitest · 2026. decembertől Python + FastAPI modellszolgáltatás.

Az indoklás és a teljes függőség-tiltólista: `docs/dontesek.md` (D-0001).

## Konzulensi bemutatóhoz

A design mérföldkő anyaga két dokumentum: `docs/terv.md` (képernyők, navigáció, adatmodell) és `docs/design.md` (design rendszer).