# Döntések

> **Miért így épül a rendszer?** Minden nem triviális döntés egy szakasz, indoklással és a mérlegelt alternatívákkal. Ezekből lesz a szakdolgozat „tervezési döntések” fejezete – utólag nem kell rekonstruálni.
> Szabály: új döntés = új szakasz (`D-xxxx`); a minta a fájl végén van. Döntést nem törlünk, csak felváltunk: a régi státusza „felváltva: D-xxxx” lesz.

## D-0001 – Next.js + TypeScript + PostgreSQL (Supabase) stack, szigorú függőség-kerettel

- **Státusz:** hatályos (2026-10-14)
- **Kapcsolódó:** `docs/terv.md`, `docs/design.md`, `AGENTS.md`, `README.md`

## Kontextus

Néptáncegyesületi ruhakölcsönzéshez készülő leltározó webalkalmazás (szakdolgozat, programtervező informatikus BSc).
A projekt **2026. október – 2027. május** között készül, **egy fejlesztővel**, AI-asszisztált módon, és a leadás után **egy valós egyesületnél kell üzemeltethetőnek maradnia**. A fejlesztő PHP / JavaScript / SQL gyakorlattal indul.

Kényszerek:

- Több száz – néhány ezer ruhadarab, sok képpel; reszponzív (asztali + mobil).
- Szerepkör-alapú működés (adminisztrátor, leltáros, tag) és teljes műveleti naplózás.
- 2026. decemberben gépi tanulás alapú képosztályozó integrálása (Python ökoszisztéma).
- A projekt sokáig tart, tehát az **átláthatóság és a karbantarthatóság** fontosabb, mint a kezdeti fejlesztési sebesség.
- AI-asszisztált fejlesztés (AI Log vezetése kötelező) → az AI-eszközök pontossága a stack ismeretében mérhetően jobb.

## Döntési szempontok

1. **Fenntarthatóság egy fejlesztővel, 8 hónapon át** – súly: nagyon nagy
2. **Kevesebb mozgó alkatrész / kevesebb függőség** – súly: nagy
3. Típusbiztonság a teljes láncon (adatbázis → szerver → felület) – súly: nagy
4. Költség (diákként, illetve egy kis egyesületnél) – súly: közepes
5. Meglévő tudás (PHP/JS/SQL) hasznosulása – súly: közepes
6. AI-asszisztált fejlesztés hatékonysága – súly: közepes
7. Szakdolgozatban bemutatható tervezési mélység – súly: közepes

## Mérlegelt alternatívák

| Alternatíva | Előny | Hátrány | Miért nem az lett? |
| --- | --- | --- | --- |
| **Next.js + TypeScript + Supabase** | egy nyelv az egész stacken, típusbiztonság, ingyenes indulás, kész bejelentkezés + fájltár, a legjobb AI-támogatás | a Postgres és a Next saját fogalmait meg kell tanulni | **ez lett a döntés** |
| Laravel + Inertia (React) + PostgreSQL | ismerős PHP, gyors CRUD, érett ökoszisztéma | két nyelv (PHP + TS), gyengébb végponttól végpontig típusbiztonság | a hosszú távú karbantartás miatt nem |
| ASP.NET Core + EF Core + React | erős típusosság, „nagyvállalati” minta | C# + TS két világ, lassabb iteráció, drágább hoszting | túl nagy súrlódás egy fős, 8 hónapos projekthez |
| Nuxt/Vue 3 + Supabase | szintén egy nyelv, jó fejlesztői élmény | a választott UI-építőkészlet React-központú; a React-tudás nem hasznosul | a React-ökoszisztéma és az AI-támogatás miatt nem |
| Next.js + külön NestJS backend | klasszikus háromrétegű felépítés, tiszta API-szerződés | két alkalmazás, két deploy, dupla konfiguráció | egy fős, 8 hónapos projektnél aránytalan |

## Döntés

**Frontend + „backend for frontend”:** Next.js 16 (App Router) + React 19 + TypeScript (`strict`), Node.js **24 LTS**.
**UI:** Tailwind CSS 4 + shadcn/ui (a komponensek *kódként* a repóba kerülnek, nem fekete doboz csomagként) + világos/sötét téma.
**Adatbázis:** PostgreSQL a Supabase-en (Auth + Storage szolgáltatással), **Drizzle ORM**-mal és verziókövetett SQL migrációkkal.
**Üzleti logika:** keretrendszertől független `src/server/**` réteg (tiszta TypeScript), ami adatbázis nélkül egységtesztelhető.
**Gépi tanulás (2026. december):** külön **Python + FastAPI** szolgáltatás HTTP-szerződéssel, a webalkalmazástól elválasztva.

Az alkalmazás **Postgres-ként** használja a Supabase-t, nem platformként: a séma és a migrációk saját SQL-fájlok, a lokális fejlesztés Dockerrel fut, így bármely Postgres-szolgáltatóra vagy saját szerverre átvihető.

### Függőség-keret (a döntés szerves része)

**Cél: legfeljebb ~12 saját közvetlen futásidejű csomag + a shadcn/ui által megkövetelt Radix primitívek, és legfeljebb ~15 fejlesztői csomag.**
Nem a tranzitív fa számít (a Next.js és a keretrendszerek ezt nagyrészt meghatározzák), hanem az, hogy **a saját, közvetlen listánk minden eleme indokolt és ténylegesen használt legyen**.

#### Közvetlen futásidejű függőségek

| # | Csomag | Mire kell | Ha nem lenne |
| --- | --- | --- | --- |
| 1 | `next` | keretrendszer: útvonalak, szerver-komponensek, szerver akciók, képoptimalizálás | nincs értelmes alternatíva a stackben |
| 2 | `react`, `react-dom` | felületi réteg (a Next peer-függősége) | nem választható le |
| 3 | `@supabase/supabase-js` | bejelentkezés, jelszókezelés, session, fájltár | saját auth (lásd: Következmények) |
| 4 | `@supabase/ssr` | cookie-alapú session szerver-komponensekben és szerver akciókban | kézi cookie-kezelés, biztonsági kockázat |
| 5 | `drizzle-orm` | típusbiztos lekérdezések, séma-leírás | kézzel írt SQL (több kód, kisebb biztonság) |
| 6 | `postgres` | adatbázis-illesztő (postgres.js) | `pg` (ugyanaz, több boilerplate) |
| 7 | `zod` | egy validációs séma kliensen és szerveren, ebből származó TS-típusok | kézzel írt ellenőrzések – elvetve |
| 8 | `clsx` | feltételes osztálynevek | sablonstring-összefűzés |
| 9 | `tailwind-merge` | Tailwind osztályütközések feloldása a `cn()` segédfüggvényben | komponens-variánsoknál ütközések |
| 10 | `class-variance-authority` | komponens-variánsok (a shadcn/ui ezt használja) | saját variáns-kezelő írása |
| 11 | `lucide-react` | ikonok (fa-rázással csak a használt ikonok kerülnek a bundle-be) | kézzel írt SVG-k |
| 12 | `next-themes` | világos/sötét mód | saját cookie + inline script megoldás (~40 sor) |
| + | `@radix-ui/react-*` | kizárólag azok a primitívek, amiket egy konkrét shadcn komponens megkövetel (pl. `dialog`, `dropdown-menu`, `select`, `label`). Jelenlegi becslés: 4–6 csomag | saját, akadálymentes dialógus/lenyíló komponensek heteket vinnének el |

**Induláskor telepítendő shadcn komponensek (ez szabja meg a Radix-listát):** `button`, `input`, `label`, `select`, `card`, `table`, `badge`, `dialog`, `dropdown-menu`, `sheet`, `sonner`, `skeleton`; az űrlapok saját mintával készülnek (nem `react-hook-form`).

#### Fejlesztői függőségek

`typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`, `drizzle-kit`, `vitest`, `husky`, `lint-staged`.

Ezek nem kerülnek a felhasználóhoz futó kódba, ezért itt a szempont a hasznosság, nem a spórolás. Később (január, tesztelés fázis) várhatóan ehhez jön a `@playwright/test` – az akkori ADR-ben.

#### Kimondottan elvetett csomagok (és miért)

| Elvetett csomag | Helyette |
| --- | --- |
| `axios` | beépített `fetch` |
| `jest` | `vitest` (egy eszköz, natív TypeScript/ESM támogatás) |
| `express`, `nest`, `fastify` | Next szerver akciók + szerver-komponensek (a BFF szerepét a Next tölti be) |
| `prisma` | `drizzle-orm` (nincs generált kliens + külön motor, SQL-közeli) |
| `redux`, `zustand`, `jotai` | szerver-komponens adatbetöltés + `useState` + URL-lekérdezési paraméterek |
| `@tanstack/react-query` | szerver-komponensek és célzott gyorsítótár-invalidálás |
| `@tanstack/react-table` | saját lista-komponens (a szűrők az URL-ben élnek → megosztható linkek) |
| `react-hook-form`, `@hookform/resolvers` | natív űrlapok + szerver akciók + `useActionState` + Zod |
| `moment`, `date-fns`, `dayjs` | beépített `Intl.DateTimeFormat('hu-HU', …)` |
| `uuid`, `nanoid` | beépített `crypto.randomUUID()` |
| `bcryptjs`, `argon2` | a jelszókezelést a Supabase Auth végzi |
| `lodash` | beépített tömb- és objektummetódusok |
| `multer`, `formidable` | szerver akció fájlfeltöltés + Supabase Storage |
| `winston`, `pino` | saját strukturált naplózó segédfüggvény + a saját `activity_log` tábla |
| `i18next` | saját szótárfájl + `Intl` (a többnyelvűség később külön ADR-t kap) |
| `node-cron` | későbbi döntés (önálló ütemező vagy Supabase `pg_cron`) |
| `framer-motion`, `chart.js`, `recharts` | amíg nincs statisztika-oldal, nem kell; a januári riportoknál **külön ADR** dönti el |
| `classnames` | `clsx` (kisebb, ugyanaz) |
| `material-ui`, `bootstrap`, `antd` | shadcn/ui (a kód a saját repóban van, szabadon szabható) |

#### Új függőség felvételének szabálya

Bármely új közvetlen csomag előtt **írásban** (ADR vagy a meglévő ADR kiegészítése) meg kell válaszolni:

1. Van-e **beépített platform** megoldás? (Web API: `Intl`, `crypto`, `fetch`, `URL`, `File`; Node beépített modulok)
2. Van-e megoldás a **már meglévő** stackben (Next / React / Tailwind / shadcn)?
3. **Tényleg** kell most? (Ha nem az aktuális hónap feladata, elhalasztjuk.)
4. **Karbantartottság:** volt-e kiadás az elmúlt 6 hónapban? Van-e nyitott kritikus hiba? Hány karbantartója van?
5. **Méret és hatás a kliensre:** tényleg a böngészőbe kerül-e, és mennyivel?
6. **Licenc:** MIT / Apache-2.0 / ISC elfogadható; GPL/AGPL kerülendő.
7. Felvétel után: `pnpm-lock.yaml` commit, ADR-bejegyzés, és **ha egy hónapig nem használjuk → törölni kell**.

#### Rutinok a függőségek kordában tartására

- A `pnpm-lock.yaml` a verziókövetésben van; a CI `pnpm install --frozen-lockfile`-lal telepít (nincs „véletlen” verziócsere).
- Havonta egyszer: `pnpm outdated`, `pnpm audit --prod`, majd frissítés **külön commitban, zöld tesztekkel**.
- A „frissítsünk mindent, mert új” nem cél; a biztonsági frissítés igen.
- `pnpm why <csomag>`: ha egy csomag csak tranzitívan került be, nem nyúlunk hozzá, csak biztonsági okból.

## Következmények

- **Pozitív:**
  - Egy nyelv az egész stacken (TypeScript), így az adatbázis-séma, a validáció és a felület ugyanazokat a típusokat használja.
  - Kicsi, indokolt, dokumentált függőséglista → kevesebb frissítési kényszer, kisebb biztonsági felület, kevesebb „elromlott a build” eset.
  - A fő komponenskészlet (shadcn/ui) a saját repóban van, tehát szabadon szabható és nem tűnik el egy csomagfrissítésben.
  - Az AI-eszközök pontosan ismerik ezt a stacket → pontosabb generált kód, kevesebb utólagos javítás (ez közvetlenül mérhető az AI Logban).
  - A projekt költsége diákként nulla, egyesületi szinten is alacsony.

- **Negatív / elfogadott kompromisszum:**
  - A `@supabase/supabase-js` a `postgrest-js`, `realtime-js`, `functions-js` alcsomagokat is behozza, bár az adatbázis-elérést Drizzle végzi. Elfogadott, mert a bejelentkezés és a fájltár ennyiért nagyon kedvező ár, és ezek a részek kliensoldalon nem használtak (fa-rázással kiesnek).
  - A Radix primitívek száma a használt komponensek számával nő. Tudatos csere: a helyettük kézzel írt, akadálymentes komponensek sokkal többe kerülnének.
  - A Next.js saját fogalmait (szerver-komponens, szerver akció, gyorsítótár-invalidálás) meg kell tanulni – egyszeri tanulási költség, cserébe kevesebb kliensoldali kód.
  - A tanulási szakaszban néha lassabb lehet, mint egy Livewire/Blade-alapú megoldás lett volna.

- **Mit zár ki, és mi a kilépési út:**
  - Saját jelszókezelés nem lesz. Ha mégis szükség lenne rá: `jose` (JWT) + saját session tábla, de ez heteket és biztonsági kockázatot jelent – nem javasolt.
  - A Supabase-től való függés csak a bejelentkezésre és a fájltárra terjed ki. Az adatbázis-séma és a migrációk hordozhatók (sima SQL), a fájltár egy `ImageStorage` port mögött van, így Cloudflare R2 / S3 / saját szerver egy fájl cseréjével elérhető.
  - A Next.js-hez kötődünk. A `src/server/**` üzleti logika keretrendszertől független, ezért egy esetleges külön backendre költözés a szerver-réteget nem érintené.

## Felülvizsgálat

A döntést újra elő kell venni, ha:

- a **ruhaszám 10 000 fölé** kerül, vagy a lista/képfeltöltés érezhetően lassul (indexek, bélyegképek, gyorsítótár – új ADR);
- az egyesület **nem tudja fizetni** a Supabase Pro csomagot, és a Free csomag korlátai (1 hét inaktivitás utáni szüneteltetés, 1 GB fájltár) akadályozzák a használatot → önhosting vagy fájltár-áthelyezés (új ADR);
- a **képosztályozó pontossága** nem éri el a kitűzött szintet (2026. december, új ADR a modellről és a szolgáltatás-szerződésről);
- bármely közvetlen függőség karbantartása megszűnik, vagy kritikus biztonsági hiba marad nyitva benne;
- a dolgozat konzulense olyan technológiai elvárást fogalmaz meg, ami ezzel ellentétes (ez minden más szempontot felülír).

## D-0004 – Kliensoldali függetlenség: nincs külső letöltés, minden eszközön ugyanaz

- **Státusz:** hatályos (2026-10-14)
- **Kapcsolódó:** `docs/design.md` (tokenek, rendszerbetűk), `docs/terv.md` (indulási ellenőrzőlista), `AGENTS.md`

**Kontextus.** Az egyesület tagjai és a leltáros különböző gépekről érik el a rendszert: régi és új telefonok, tablet, otthoni és irodai számítógép, gyakran lassú hálózaton. Senki nem fog alkalmazást telepíteni, bővítményt engedélyezni vagy fiókot létrehozni egy külső szolgáltatásnál. A rendszernek **bármely böngészőben, letöltés nélkül, ugyanolyan képességekkel** kell működnie, és lehetőleg semmilyen külső szolgáltatástól nem szabad függenie futásidőben (se betűtípus, se CDN, se követőkód).

**Mérlegelt alternatívák.** (1) Letöltött webfont + külső UI-könyvtár CDN-ről: szebb alapból, de plusz kérés, adatvédelem és kiszolgálófüggés. (2) Kliensoldali „app-szerű” felület (sok JavaScript): gyorsabb érzet, de lassabb első betöltés és JS nélkül használhatatlan. (3) **Szerver-oldali HTML + minimális JS (ez lett):** minden eszközön működik, kicsi a letöltés, és a rendszer nem függ idegen szolgáltatásoktól.

**Döntés – tíz szabály, ami a fejlesztés közben kötelező:**

1. **Nulla külső kérés futásidőben.** Egy betöltött oldal kizárólag a saját domainről kérhet erőforrást: nincs Google Fonts, nincs CDN, nincs analitika, nincs külső avatar-szolgáltatás, nincs beágyazott videó. **Ellenőrzés:** a böngésző hálózati paneljén egyetlen idegen domain sem szerepelhet (a januári teljesítményteszt része).
2. **Rendszerbetűk** – nincs webfont (a `docs/design.md` már így rögzíti).
3. **A tartalom a HTML-ben érkezik**, nem JavaScript építi fel. A tartalom szerveroldalon renderelődik.
4. **A kritikus folyamatok JavaScript nélkül is működnek** (bejelentkezés, lista, keresés, felvitel, kiadás): natív űrlap + szerver akció. A JavaScript csak kényelmet ad (azonnali keresés, előnézet, dialógus, téma váltás).
5. **A kliensoldali JavaScript kerete: ~200 KB (tömörítve) a főoldalakon.** Ha egy funkció ezt érdemben túllépi, nem kerül be – ezért maradt ki a táblázat- és adatlekérdező könyvtár.
6. **A képek adják a legnagyobb súlyt**, ezért: feltöltéskor átméretezés (hosszú él max. 1600 px, 200–300 KB), külön bélyegkép (max. 400 px) a listákhoz, modern formátum (WebP), késleltetett betöltés és fix méretarány. **A listában soha nem töltünk teljes méretű képet.**
7. **Eszköz-mátrix:** Android Chrome, iOS Safari, asztali Chrome / Edge / Firefox; legkisebb támogatott szélesség 320 px. Régebbi eszközön (Safari < 16) a lista mobilon táblázatként marad – csúnyább, de nem törik el.
8. **Nincs telepítés:** böngészőből működik, alkalmazásbolt, bővítmény és plugin nélkül. Telepíthető (PWA) és offline mód csak később, külön döntéssel.
9. **A kamera csak lehetőség:** a QR-beolvasás kényelmi funkció; a kód kézi beírása mindig elérhető, így kamera nélküli eszközön is teljes értékű a rendszer.
10. **Nyomtatás:** a címkék nyomtatási stíluslappal készülnek (nem képként), hogy bármilyen nyomtatóval és böngészővel működjenek.

**Következmények.** *Pozitív:* minden eszközön ugyanaz a rendszer, gyors első betöltés, nincs külső adatszivárgás, és a rendszer akkor is működik, ha egy külső szolgáltatás kiesik. *Negatív / elfogadott kompromisszum:* lemondunk néhány kényelmi könyvtárról (gazdagabb táblázat, animációk), a szerver-oldali megoldásokat kézzel írjuk meg, és a Next.js keret JavaScriptje önmagában is letöltődik (ez alól nem tudunk mentesülni – a cél a *kevés és indokolt* letöltés). A fejlesztői gépen a csomagok letöltése elkerülhetetlen, de a `pnpm-lock.yaml` miatt reprodukálható. *Kilépési út:* bármelyik szabály külön döntéssel módosítható, ha a használhatósági teszt mást mutat.

**Felülvizsgálat.** Ha a januári teljesítményteszt mobilon lassúnak méri a listát; ha az egyesület régi telefonokat használ; ha a fotók mennyisége miatt a tároló megtelik; vagy ha egy kritikus folyamat JavaScript nélkül mégsem működik.

## D-0005 – A felület saját, minimális komponenskészlettel indult

- **Státusz:** hatályos (2026-10-14)
- **Kapcsolódó:** `docs/design.md` (komponenskészlet), D-0001, D-0004

**Kontextus.** Az októberi design mérföldkő bemutatójára működő váz kellett. A shadcn/ui generátor (és a mögötte álló Radix primitívek), valamint a `next-themes`, `clsx`, `tailwind-merge`, `cva`, `lucide-react` csomagok behúzása olyan döntéseket és időt igényelt volna, amelyekre a vázhoz nem volt szükség.

**Mérlegelt alternatívák.** (1) shadcn/ui CLI-vel minden komponens: kész, akadálymentes elemek, de több csomag és generátorfüggés. (2) **Saját, kézzel írt minimális készlet (ez lett):** nulla új függőség, teljes kontroll. (3) Teljes saját komponenskészlet dialógusokkal: heteket vinne el.

**Döntés.** A felület első változata saját komponenskészlettel készült (`src/components/ui/**`), a shadcn/ui mintáját követve: a kód a saját repóban van, a hívási felület (props) szándékosan a shadcn-ével egyezik. Ikonok: saját SVG-k. Téma: ~30 soros váltó beágyazott szkripttel. Osztálynév-összefűzés: 3 sor. Radix primitívek és `next-themes` **egyelőre nincs**.

**Következmények.** *Pozitív:* a kezdő függőséglista a dokumentált kereten belül maradt, kisebb a böngészőbe kerülő kód, és nincs olyan csomag, amit egy hónapig nem használnánk. *Negatív / elfogadott kompromisszum:* akadálymentes dialógust, legördülő menüt és parancslistát (kereső) kézzel írni drága – amikor egy konkrét funkció megköveteli (várhatóan november, kiadás-visszavétel megerősítő ablakok), akkor húzzuk be a shadcn/ui CLI-t. *Kilépési út:* a komponensek egyenként cserélhetők, mert a props-felület azonos.

## Következő döntések (október vége)

- **D-0002 – Bejelentkezés és szerepkörök.** Supabase Auth (cookie-alapú session) + saját `can()` jogosultsági modul, két rétegben. A döntés indoklása és a szerepkör-mátrix itt kap helyet; a szerepkörök addig `docs/terv.md`-ben olvashatók.
- **D-0003 – Egyedi azonosítók.** Belső UUID + olvasható `TÍPUS-SORSZÁM` kód (pl. `ING-0042`), tranzakciós sorszámgenerálással. Az adatmodell-vázlat `docs/terv.md`-ben van, az indoklás ide kerül.

## Új döntés mintája

```
## D-xxxx – <döntést kifejező cím>

- **Státusz:** javaslat | hatályos | felváltva: D-xxxx · **Dátum:** ÉÉÉÉ-HH-NN · **Kapcsolódó:** …

**Kontextus:** milyen helyzet, milyen kényszerek (idő, tudás, költség, teljesítmény, biztonság, hordozhatóság)?

**Mérlegelt alternatívák:** alternatíva | előny | hátrány | miért nem az lett

**Döntés:** egy bekezdés, konkrétan.

**Következmények:** mit nyerünk · mit veszítünk (elfogadott kompromisszum) · mihez kötődünk, és mi a kilépési út.

**Felülvizsgálat:** milyen esemény vagy mérőszám hatására vesszük elő újra?
```

