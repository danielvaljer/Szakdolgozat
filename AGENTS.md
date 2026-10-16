# AGENTS.md – a projekt házirendje (embernek és AI-eszköznek egyaránt)

> Ezt a fájlt **minden fejlesztési menet elején el kell olvasni** (embernek és AI-asszisztensnek is).
> Célja, hogy a projekt 8 hónap után is ugyanolyan átlátható legyen, mint az első napon.

## 1. Mit építünk

Néptáncegyesületi **ruhaleltár és kölcsönzéskezelő** webalkalmazás (szakdolgozat). Ruhák, tagok, kiadás–visszavétel, teljes műveleti naplózás, szerepkörök (adminisztrátor, leltáros, tag), később gépi tanulás alapú képosztályozás. Cél: könnyen használható, gyors, több ezer ruhát kezelő, hosszú távon fenntartható rendszer.

## 2. Rögzített technológiai döntések

Node.js **24 LTS** · `pnpm` · **Next.js 16** (App Router) · **React 19** · **TypeScript strict** · **Tailwind CSS 4** · **shadcn/ui** · **Drizzle ORM** + **PostgreSQL (Supabase)** · Supabase **Auth + Storage** · **Vitest** · (2026. decembertől) **Python + FastAPI** modellszolgáltatás.

- A részletes indoklás és a **teljes tiltólista**: `docs/dontesek.md` (D-0001).
- **Új közvetlen függőség csak döntés-dokumentummal** vehető fel (`docs/dontesek.md`), a hét kérdésből álló ellenőrző lista kitöltésével.

## 3. Nyelvhasználat

- **Kód, fájlnevek, adatbázis, változók, típusok:** angol. (Adatbázisban is angol oszlopnevek – a magyar megnevezés a felület dolga.)
- **Felhasználói szöveg:** magyar, **egy helyen** (`src/lib/i18n/hu.ts`). Felületbe írt magyar szöveg tilos – így a későbbi többnyelvűség nem lesz átírás.
- **URL-ek (útvonalak):** magyarul, mert a felhasználó látja és megosztja őket (`/ruhak/ING-0042`). A fájl- és mappanevek, komponensek, adatbázis továbbra is angolok (`src/app/ruhak/[kod]/page.tsx`).
- **Dokumentáció:** magyar. **Commit üzenet:** angol (Conventional Commits).

## 4. Rétegek – hol mi történhet

| Réteg | Hely | Szabály |
| --- | --- | --- |
| Útvonalak, nézetek | `src/app/**` | HTTP és megjelenítés. **Adatbázist közvetlenül nem hív**, szolgáltatást hív. |
| Üzleti logika | `src/server/services/**` | A szabályok, tranzakciók, jogosultság, naplózás helye. **React/Next import tilos** → adatbázis nélkül tesztelhető. |
| Adatelérés | `src/server/db/**` | Drizzle séma + repository-k. **Az egyetlen hely, ahol lekérdezés van.** |
| Tiszta segédfüggvények | `src/lib/**` | Validáció, azonosító-generálás, dátum-, pénz- és szövegformázás. **Kötelezően tesztelt**, mellékhatás nélkül. |
| Megjelenítő komponensek | `src/components/**` | Csak megjelenítés; üzleti döntés nem lehet benne. |

> **Megjegyzés:** a `src/server/**` réteg az adatbázis bekötésével együtt készül el (október vége). Addig az üzleti logika a `src/lib/**`-ben van – keretrendszertől független, tesztelt tiszta függvények formájában (pl. `lib/query.ts`).

## 5. Elnevezési szabályok

- Adatbázis táblák: `snake_case`, többes szám (`garments`, `loans`, `activity_log`); oszlopok is `snake_case`.
- Elsődleges kulcs mindig `id`; idegen kulcs `<tábla_egyes_szám>_id` (pl. `garment_id`).
- TypeScript: típusok `PascalCase`, függvények/változók `camelCase`, fájlok `kebab-case`.
- Fájlvégződések: szerver akciók `*.actions.ts`, Zod sémák `*.schema.ts`, tesztek `*.test.ts` a vizsgált fájl mellett.

## 6. Kötelező minták

- **Jogosultság:** minden szolgáltatás első sora `requirePermission(...)`. A felület csak *elrejti* a tiltott lehetőséget; a **védelem a szerveren van**.
- **Naplózás:** minden író művelet a `withAudit(...)` burkolón keresztül megy (ki, mikor, mit, előtte/utána).
- **Validáció:** Zod séma a rendszer határán **és** adatbázis-megkötés (`NOT NULL`, `CHECK`, egyedi index) – mindkettő, mert más-más hibától véd.
- **Hibakezelés:** a szolgáltatás `Result<T>` típust ad vissza (siker/hiba); kivételt csak programhibára dobunk. A hibaszöveg magyarul a felületen jelenik meg.
- **Adatbázis-változás:** kizárólag **új** migrációs fájl. Már lefutott migrációt módosítani tilos.
- **Titkok:** `.env.local` (nincs a verziókövetésben), mellette `.env.example` a repóban. Kulcs soha nem kerül commitba.

## 7. Amit tilos

- saját jelszókezelés, saját kriptográfia;
- **külső erőforrás futásidőben:** CDN-ről töltött könyvtár, webfont, analitika, külső avatar- vagy térkép-szolgáltatás – minden a saját domainről jön (`docs/dontesek.md` D-0004);
- `any`, `@ts-ignore`, `eslint-disable` indoklás nélkül;
- maradék `console.log`, halott kód, jegy nélküli TODO (helyette: `TODO(2026-11-01, ok)`);
- adatbázis-hívás komponensből;
- felhasználói szöveg beégetése a felületbe;
- új függőség ADR nélkül;
- létező, lefutott migráció átírása;
- döntés, ami csak a kódban vagy csak a fejben létezik – dokumentumba kell.

## 8. Munkafolyamat (AI-val is)

1. A feladat tisztázása: mit, miért, a tématerv melyik hónapjához tartozik.
2. Ha van érintett dokumentum, **előbb** azt frissítjük (döntés → dokumentum → kód).
3. Implementáció + teszt együtt.
4. Futtatás: `pnpm lint`, `pnpm typecheck`, `pnpm test`.
5. Dokumentáció és **AI Log** bejegyzés – a változások listája maga a commit üzenet.
6. Commit a 11. pont (kész-definíció) ellenőrző listája szerint.

## 9. Commit minta (Conventional Commits)

```
feat(garments): egyedi azonosito generalasa tipus-prefixszel

- code_sequences tablazat + tranzakcios noveles
- teszt: parhuzamos felvitel utani egyediseg

AI-Assisted: Cline (Claude) - docs/ai-log.md
Refs: docs/dontesek.md
```

Előtagok: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`. Ha a munka AI-segítséggel készült, az `AI-Assisted` sor **kötelező** – ez az AI Log és a valóság összekapcsolása.

## 10. Parancsok

> A scaffold után élnek (a `/README.md`-ben is szerepelnek).

| Parancs | Mire való |
| --- | --- |
| `pnpm dev` | fejlesztői szerver |
| `pnpm lint` / `pnpm typecheck` | statikus ellenőrzés |
| `pnpm test` / `pnpm test:watch` | egységtesztek |
| `pnpm db:generate` / `pnpm db:migrate` | migráció készítése / futtatása |
| `pnpm db:seed` | törzsadatok és mintaadatok betöltése |
| `supabase start` / `supabase stop` | lokális adatbázis (Docker) |

## 11. Kész-definíció

Egy feladat akkor kész, ha az alábbi mind teljesül. Ez a lista rövid szándékosan – ha egy pont nem teljesül, a feladat nincs kész.

**Kód:** a megfelelő rétegben van (4. pont); nincs `any`, indoklás nélküli kikapcsolás, maradék naplózás; a felhasználói szöveg a szótárból jön; `pnpm lint`, `pnpm typecheck`, `pnpm test` zöld; van teszt az új viselkedésre.

**Adatbázis:** új migrációs fájl (a régi nem módosul); megkötés (`NOT NULL` / `CHECK` / egyedi), ahol értelmes; index a szűrt és keresett oszlopokra; `docs/terv.md` adatmodell-szakasza frissült.

**Funkció:** jogosultság-ellenőrzés a szerveren is; írás a naplózó burkolón át; üres, betöltő és hibaállapot magyarul; megerősítés romboló műveletnél; reszponzív; világos és sötét módban is helyes.

**Dokumentáció:** az érintett dokumentum frissült (12. pont); döntésnél `docs/dontesek.md`; `docs/ai-log.md` bejegyzés, ha AI segített – eszközzel, módosításokkal és **ellenőrzéssel** együtt.

**Mérföldkőnél:** a hónap céljai kipipálva; konzultációra működő állapot; konzultációs jegyzet; az ismert hiányosságok listája leírva.

## 12. Mikor mit kell frissíteni

| Ha ez történik… | …ezt kell frissíteni |
| --- | --- |
| Új vagy módosított képernyő | `docs/terv.md` (képernyők) · `docs/design.md`, ha megjelenés is változik |
| Új vagy módosított tábla, oszlop | `docs/terv.md` (adatmodell) + új migráció |
| Új technológia vagy függőség | `docs/dontesek.md` |
| Új minta (pl. naplózás, hibakezelés) | `AGENTS.md` + `docs/terv.md` |
| Bármilyen AI-asszisztált munka | `docs/ai-log.md` |
| Bármi, ami a tervhez képest változik | commit üzenet (Conventional Commits) |

## 13. Három szabály, ami a dokumentációt rendben tartja

1. **Egy tény, egy helyen.** Ha valami két dokumentumban is szerepel, az egyik helyen hivatkozás lesz belőle.
2. **Döntés előbb dokumentumba, aztán kódba.** Ha egy döntést nem lehet három mondatban leírni, akkor még nem született meg.
3. **Diagram Mermaid-ben, a Markdown fájlba ágyazva** – így a verziókövetés diffeli, és nem avul el csendben.

## 14. Git és GitHub – kizárólag a fejlesztő kezében

- **A verziókövetést a fejlesztő végzi.** Az AI-eszköz **nem** push-ol, **nem** hoz létre vagy módosít remote-ot, és nem nyúl a git beállításaihoz – akkor sem, ha a feladat része lenne.
- **Commit (helyben) is csak kérésre:** az AI-eszköz csak akkor commitol, ha a fejlesztő erre kifejezetten engedélyt ad.
- Az AI-eszköz git parancsot **kizárólag olvasásra** használhat (`status`, `diff`, `log`, `remote -v`) – a repó állapotának ellenőrzésére, a fejlesztő tájékoztatására.
- A változások listája a **git-történet** (Conventional Commits üzenetekkel) – ezért nincs külön `CHANGELOG.md` fájl.
- Ha az AI-eszköz kész egy munkával, **megmondja, mi van kész és mi nincs commitolva**, és átadja a döntést: a fejlesztő commitol és push-ol, amikor jónak látja.
