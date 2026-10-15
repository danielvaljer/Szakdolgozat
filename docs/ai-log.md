> **Hogyan készült a rendszer?** Ez a napló az AI-asszisztált munka bizonyítéka, és a szakdolgozat „AI-asszisztált fejlesztés” szakaszának forrása. Nem az a lényeg, hogy szép legyen, hanem hogy **ellenőrizhető** legyen.

**Új bejegyzés** mindig a fájl végére kerül, `# DÁTUM – téma` címmel, az alábbi pontokkal:

- **Menet:** eszköz/modell · feladat típusa (kód / terv / dokumentáció / hibakeresés) · érintett fájlok
- **Cél:** mit akartam elérni (a tématerv melyik hónapja)
- **Hogyan:** hány kör, milyen kontextust adtam, melyik prompt működött
- **AI szerepe:** mit adott, melyik fájl melyik része származik tőle
- **Mit módosítottam vagy vetettem el – és miért:** javítások, elutasított javaslatok, téves állítások
- **Hogyan ellenőriztem:** futtatás, teszt, élő forrás, kézi próba. („Átnéztem és jónak tűnik” **tilos**.)
- **Emberi döntések:** amit én döntöttem el, nem az AI
- **Tanulság:** mi lesz legközelebb is jó, és mi nem
- **Következő lépések:** konkrét, ellenőrizhető feladatok

*A 2026-10-14-i bejegyzések fájlnevei a dokumentum-konszolidáció előtti állapotot tükrözik (akkor még külön ADR- és naplófájlok voltak).*

---


# 2026-10-14 – Projektindítás: stack- és függőségkeret-döntés

## 0. Fejléc

| Mező | Érték |
| --- | --- |
| Dátum | 2026-10-14 |
| Eszköz / modell | Cline (VS Code) + Claude, webes ellenőrzéssel (npm registry, nodejs.org, supabase.com) |
| Feladat típusa | terv / dokumentáció |
| Kapcsolódó fájlok | `docs/adr/0000-sablon.md`, `docs/adr/0001-technologia-es-fuggosegkeret.md`, `docs/README.md`, `docs/definition-of-done.md`, `docs/ai-log/0000-sablon.md`, `AGENTS.md` |
| Becsült idő | ~2 óra (1 konzultációs kör + 1 döntési kör + dokumentálás) |

## 1. Feladat és cél

A tématerv (2026. október – 2027. május) első lépése: **a technológiai döntés meghozatala** úgy, hogy az a következő 8 hónapban ne kelljen újra elővenni. Kiegészítő követelmény a fejlesztő részéről: **ne legyen sok függőség**, mert a projektet hosszú ideig kell karbantartani.

## 2. Hogyan dolgoztam

Egy körben kértem javaslatot: a tématerv fájljának elolvasása után stack-alternatívák, indoklással. A kontextus a tématerv volt (adatmodell, szerepkörök, képfeldolgozás, ezer ruhadarab, reszponzivitás). A javaslat megérkezése után szűkítettem: „A opció, de kevés függőséggel”. Az asszisztens ekkor nem kódot, hanem **döntés-dokumentumot** írt (ADR + házirend), ez volt a tudatos választásom: a döntés legyen megfogható, ne a beszélgetésben maradjon.

## 3. Az AI szerepe

- Összehasonlító táblázat öt stack-alternatíváról (Next.js+Supabase, Laravel+Inertia, ASP.NET Core, Nuxt+Supabase, Next.js+külön NestJS backend) előnyökkel és hátrányokkal.
- Élő verzióellenőrzés (nem emlékezetből): `next@16.4.0`, `react@19.3.0`, `tailwindcss@4.3.3`, `drizzle-orm@0.45.4`, `@supabase/supabase-js@2.117.3`, Node.js **24 LTS** (Krypton), valamint a Supabase Free/Pro csomag korlátai.
- A függőség-keret első vázlata: közvetlen futásidejű lista, fejlesztői lista, elvetett csomagok táblázata, felvételi szabály, karbantartási rutin.
- Az `AGENTS.md`, a `docs/README.md`, a kész-definíció és az AI Log sablon szövege.

## 4. Mit módosítottam vagy vetettem el – és miért

| # | Amit az AI adott | Amit én tettem vele | Miért |
| --- | --- | --- | --- |
| 1 | Verziószámok és csomagkorlátok | Nem hittem el vakon; az asszisztens élő forrásból ellenőrizte (npm registry, nodejs.org, supabase.com/pricing) | Egy 8 hónapos projekt alapja nem épülhet emlékezetből idézett verziókra |
| 2 | „Kis függőséglista” (12 közvetlen csomag) | Elfogadtam, de kértem a **rejtett** költségek kimondását is: a Supabase csomag 3 nem használt alcsomagot hoz, a shadcn komponensek pedig 4–6 Radix primitívet | A keret akkor őszinte, ha a kompromisszum is le van írva |
| 3 | Alapértelmezett javaslatok: `react-hook-form`, `@tanstack/react-query`, `@tanstack/react-table`, `date-fns`, `uuid`, `axios` | **Elutasítva**, helyettük beépített megoldás (szerver akciók + `useActionState`, szerver-komponensek, URL-paraméteres szűrés, `Intl`, `crypto.randomUUID()`, `fetch`) | Ezek a „megszokott” választások, de nem szükségesek – pontosan ezek adják a függőséghalmozást |
| 4 | Saját jelszókezelés mint lehetőség (a Supabase kiváltására) | **Elutasítva**, marad a Supabase Auth | A saját auth heteket vinne el és biztonsági kockázatot hozna; ez a fajta kód nem jó tanulópénz egy szakdolgozatban |
| 5 | Az ADR, a házirend és a kész-definíció szövege | Átolvasás alatt; a döntés elfogadását és a szöveg véglegesítését én végzem | A dokumentum a fejlesztő döntéseit rögzíti, ezért emberi jóváhagyás kell rá |

## 5. Hogyan ellenőriztem

- Élő verzióellenőrzés az npm regiszterből (`registry.npmjs.org/next/latest` és társai) – a válaszban szereplő verziók innen származnak, nem emlékezetből.
- Node.js: a hivatalos kiadási oldal szerint a **24-es ág az LTS** (26-os még „Current”) – ezért lett a célverzió 24 LTS.
- Supabase díjszabás: Free = 500 MB adatbázis, 1 GB fájltár, 5 GB forgalom, 50 000 havi aktív felhasználó, **1 hét inaktivitás után szüneteltetés**; Pro = 25 USD/hó, 8 GB adatbázis, 100 GB fájltár. (A logika: a prototípus befér ingyen, az éles egyesületi használat nem feltétlenül – ezért kell az ADR-be a felülvizsgálati pont.)
- A shadcn/ui telepítési dokumentációja megerősíti a Next.js + Tailwind 4 támogatást.
- Ami **még nincs** ellenőrizve: a tényleges projekt létrehozása és a csomagok telepítése. Ez a következő menet feladata, és csak utána tekinthető a döntés „gyakorlatban is igazoltnak”.

## 6. Emberi döntések ebben a menetben

1. Az összes alternatíva közül a **Next.js + TypeScript + Supabase** irány kiválasztása.
2. A **„kevés függőség”** szempont kiemelése elsődleges követelménnyé – ez nem az AI javaslata volt, hanem a fejlesztőé.
3. Annak eldöntése, hogy a döntés **ADR-be** kerül, és hogy minden új függőséghez ADR kötelező (ez lesz a hosszú távú garancia).
4. Az adatbázis és a fájltár **hordozhatóságának** megkövetelése (saját SQL migrációk, port mögötti fájltár).

## 7. Tanulság és újrahasznosítható prompt

- **Tanulság:** az AI alapértelmezett javaslatai hajlamosak túlfüggősíteni egy projektet (mindenre van egy népszerű csomag). Ha a függőségszám cél, akkor azt **követelményként** kell kimondani, különben a kapott lista „szabványos”, de nem takarékos.
- **Tanulság:** verziót, árat, korlátot élő forrásból kell kérni, nem emlékezetből.
- **Újrahasznosítható prompt:** „Adj 3–5 alternatívát a döntésre, mindegyikhez előnyt és hátrányt. A verziószámokat és a szolgáltatások korlátait **élő forrásból** ellenőrizd, és mondd meg, mit nem tudtál ellenőrizni. A végén egy táblázatban add meg, mit használunk és mit **nem**, indoklással.”

## 8. Következő lépések

- [ ] Az `ADR-0001` és az `AGENTS.md` emberi átolvasása, elfogadása.
- [ ] A projekt vázának létrehozása (Next.js + TypeScript + Tailwind + shadcn), `.env.example`, `README.md`.
- [ ] `docs/requirements.md` (követelmények, user story-k) és `docs/ui/navigation.md` (site map, útvonal-tábla, szerepkör-mátrix) elkészítése.
- [ ] `ADR-0002` (bejelentkezés és szerepkörök) és `ADR-0003` (egyedi azonosítók) megírása.

# 2026-10-14 – Design rendszer és navigáció (natúr, karbantartható)

## 0. Fejléc

| Mező | Érték |
| --- | --- |
| Dátum | 2026-10-14 |
| Eszköz / modell | Cline (VS Code) + Claude |
| Feladat típusa | dokumentáció / terv |
| Kapcsolódó fájlok | `docs/ui/design-system.md`, `docs/ui/navigation.md`, `AGENTS.md` (3. pont kiegészítése) |
| Becsült idő | ~1,5 óra (tervezés + írás + szerkezet-ellenőrzés) |

## 1. Feladat és cél

A „design” mérföldkő első két dokumentumának elkészítése októberre: a **design rendszer** és a **navigáció/képernyőtérkép**. Új, emberi követelmény érkezett a menet közben: *„a design is legyen egyszerűen karbantartható, natúr, de az egyszerűség kedvéért lehetnek modern technológiák.”*

## 2. Hogyan dolgoztam

Egy körben kértem a két dokumentumot, megadott kontextussal (`AGENTS.md` szabályai, `ADR-0001` technológiai kerete, a tématerv funkciólistája). A kérést kiegészítettem: **nem palettát kérek, hanem döntési szabályokat**, mert a színek később úgyis változnak – a szabályok viszont nem.

## 3. Az AI szerepe

- A design tokenek szerkezete (szemantikus nevek, `:root` / `.dark` / `@theme inline` minta Tailwind 4-hez).
- Az alapelvek megfogalmazása, ezen belül a legfontosabb: **csak a kivételek kapnak színt** (a „kiadható” alapállapot semleges jelvény, nem zöld).
- A navigációs váz: oldalsáv csoportosítása, mobil alsó sáv öt hellyel, a „Beolvasás” kiemelt szerepe.
- Az URL-szerződés (szűrők, lapozás, rendezés) és a szerkesztő oldalak `?vissza=` paramétere.
- A karbantartási szabályok és a tiltólista szövege.

## 4. Mit módosítottam vagy vetettem el – és miért

| # | Amit az AI adott | Amit én tettem vele | Miért |
| --- | --- | --- | --- |
| 1 | A dokumentumokat nagy blokkokban, egy menetben szúrta be | **Hiba:** a navigációs tábla utolsó sora és a nyelvi döntés bekezdése a táblázat közepére tördelve, a „Mobil alsó sáv” szakasz után landolt. Kiszúrtam, és javíttattam (a táblázat egyben tartása, a bekezdés a helyére) | Nagy strukturált fájlt nem lehet egyben beszúrni – a beszúrás után a szerkezetet ellenőrizni kell |
| 2 | „Csak a kivételek kapnak színt” – a kiadható ruha semleges jelvényt kap | Elfogadtam. Ez az egyik legerősebb egyszerűsítő döntés: a szín így tényleg információt hordoz, nem díszít | A színes „rendben van” jelvények zaja elnyeli a valódi figyelmeztetéseket |
| 3 | Rendszerbetűk webfont helyett | Elfogadtam | Nulla letöltés, nincs betűtípus-villanás, nincs külső szolgáltatás, és a magyar `ő`/`ű` karakterek is tökéletesek |
| 4 | Hat lépcsős tipográfiai skála, két sugárérték, egyetlen árnyék | Elfogadtam | A szűk választék kényszeríti ki az egységességet; a szerkezetet vonalak adják, nem árnyékok |
| 5 | Az első változatban nem volt szabály a karbantartásra | Kiegészíttettem a 7. ponttal (token-fegyelem, tiltott tetszőleges értékek, komponens csak két helynél, formázás egy helyen) és a 8. tiltólistával | Ez a te kérésed volt: „a design is legyen egyszerűen karbantartható” – szabály nélkül ez csak szándék marad |

## 5. Hogyan ellenőriztem

- Mindkét fájlt visszaolvastam **fájlszerkezet szintjén**: táblázatok épsége, szakaszok sorrendje, szakaszszámok (0–9) folytonossága. A táblázat-tördelés így derült ki.
- Ellenőriztem, hogy a `design-system.md` CSS-mintája a Tailwind 4 tényleges mintáját követi (`:root` / `.dark` / `@theme inline`), mert a tokenek felülírása csak így működik világos/sötét módban.
- **Amit még nem tudtam ellenőrizni:** a tokenek kontrasztarányát (AA) és a tényleges megjelenést – nincs még kód, amit a böngészőben meg lehetne nézni. Ez a scaffold után kötelező lépés, és ha kell, a színértékek hangolása (a nevek nem változnak).

## 6. Emberi döntések ebben a menetben

1. A design követelménye: **natúr, letisztult, könnyen fenntartható** – nem látványos.
2. A **magyar útvonalak** megtartása (`/ruhak`, `/tagok`) az angol fájl- és táblanevek mellett; ezt beírtam az `AGENTS.md`-be is, hogy ne legyen később újra kérdés.
3. A novemberi/decemberi menüpontok a **bemutatón** szerepelnek, de az éles menüben nem lesznek „hamarosan” felirattal – inkább később jelenjenek meg, amikor már működnek.
4. A sötét mód alapértéke a „rendszer” beállítás, nem a világos.

## 7. Tanulság és újrahasznosítható prompt

- **Tanulság:** a nagy dokumentumot szakaszokban kell beszúrni, és **minden beszúrás után vissza kell olvasni a fájlt** – az AI nem érzékeli, hogy egy táblázat közepébe írt.
- **Tanulság:** a „mit **nem** csinálunk” lista értékesebb, mint a részletes stílusleírás. A tiltólista generálja a valódi egységességet.
- **Újrahasznosítható prompt:** „Készíts design rendszert úgy, hogy a **szabályok** a fontosak, ne a színértékek. Adj szín-szemantikát (mit jelöl a szín), tiltólistát és karbantartási szabályokat. A színértékek legyenek szemantikus tokenek egyetlen fájlban, világos és sötét értékkel.”

## 8. Következő lépések

- [ ] `docs/requirements.md` – funkcionális és nem funkcionális követelmények, szerepkörönkénti user story-k prioritással.
- [ ] `docs/data-model.md` – táblák, kapcsolatok, Mermaid ER diagram, indexek, azonosítóképzés.
- [ ] `ADR-0002` – bejelentkezés és szerepkörök; `ADR-0003` – egyedi azonosítók generálása.
- [ ] A kód-váz (Next.js + Tailwind + shadcn): `globals.css` a tokenekkel, `AppShell`, majd a lista- és űrlap-minták mock adattal.
- [ ] A tokenek kontrasztarányának ellenőrzése a böngészőben (AA, világos és sötét mód).

---

# 2026-10-14 – Az első működő váz: navigáció, design tokenek, ruha-lista

## 0. Fejléc

| Mező | Érték |
| --- | --- |
| Dátum | 2026-10-14 |
| Eszköz / modell | Cline (VS Code) + Claude |
| Feladat típusa | kód + dokumentáció |
| Eredmény | 35 új fájl, 15 útvonal, `typecheck` 0 hiba, 15/15 teszt, sikeres build és éles futás |
| Kapcsolódó | `docs/design.md`, `docs/terv.md`, `docs/dontesek.md` (D-0005) |

## 1. Cél

A holnapi konzultációra **működő váz** kellett: alap navigáció, design, és ami a fejlesztőnek elsődleges – a **ruhaállomány listanézet** gyors kereséssel és szűréssel. Az adatbázis réteg szándékosan még nincs bekötve.

## 2. Hogyan dolgoztam

Egy menetben, kicsi lépésekben: fájlcsoportok (konfiguráció → tokenek → tiszta logika → komponensek → oldalak), és **minden szakasz után futott az ellenőrzés** (`typecheck`, `test`, `build`). A döntéseket (lista-nézet elsődlegessége, középső mobil művelet) a fejlesztő adta, a megvalósítást az asszisztens.

## 3. Az AI szerepe

Szinte a teljes kód: projektkonfiguráció, design tokenek (`globals.css`), mintaadat-generátor, keresés/szűrés/rendezés/lapozás tiszta logikája, komponenskészlet, az összes képernyő, valamint az egységtesztek.

## 4. Mit módosítottam, hol tévedett az AI

| # | Mi történt | Hogyan derült ki | Tanulság |
| --- | --- | --- | --- |
| 1 | Hibás import: `@/lib/i18n/ha` (a `hu` helyett) | saját visszaolvasással, nem a typecheckkel | gépi generált fájlt írás után vissza kell olvasni |
| 2 | A keresés nem találta meg a „mellény” szót, mert a típus **nevét** nem tartalmazta a keresett szöveg (csak a kódját) | **az egységteszt bukott meg rajta** | ezért van teszt: valódi felhasználói hibát fogott meg, nem formai hibát |
| 3 | Nem létező szótárkulcs (`t.columns.since`) | a `typecheck` azonnal jelezte | a típusos szótár fordítási időben fogja el az elírást |
| 4 | A szűrősávban felesleges lett volna `onClick → requestSubmit` (dupla beküldés) | még írás előtt elvetve | a natív űrlap önmagában helyesen működik |
| 5 | A pnpm alapértelmezésben blokkolta az `esbuild` build-scriptjét | install hibaüzenet | `pnpm-workspace.yaml`: `allowBuilds: esbuild: true` (ez biztonsági alapértelmezés, nem hiba) |
| 6 | A dokumentum azt írta, hogy a lista mobilon „kártyákká alakul”, és container query-t említett | összevetés a megírt kóddal | a doksi igazítása: a lista sűrű sorokból áll, a váltás törésponttal történik |

## 5. Hogyan ellenőriztem

- `pnpm typecheck` → kilépési kód **0**.
- `pnpm test` → **15/15 zöld** (keresés, szűrés, rendezés, lapozás, URL-építés).
- `pnpm build` → **15 útvonal** hibátlanul lefordult.
- Éles szerver indítása és HTTP-kérések: `/attekintes` (200), `/ruhak` (200), `/ruhak?tipus=MEL&statusz=kiadva`, `/tagok`, `/ruhak/ING-0001`, `/bejelentkezes`, `/naplo` – mind 200; a HTML-ben megjelennek a ruhaadatok (`ING-…`) és a státuszjelvények; a szervert a végén leállítottam.
- **Amit még nem tudtam ellenőrizni:** a tényleges megjelenést böngészőben, a kontrasztarányt (AA) és a mobilos nézetet – ezt a bemutató előtt emberi szemmel kell megnézni, és ha kell, a színértékeket hangolni (a tokenek neve nem változik).

## 6. Emberi döntések

1. **A listanézet az elsődleges** – sok adat, gyors keresés/szűrés, ezért sűrű sorok, nem nagy kártyák.
2. A mobil alsó sáv középső művelete az **Új ruha** (a beolvasás novemberben kerül középre).
3. Az elkészülő képernyők (Kiadás, Napló, Beállítások) **láthatók maradnak a menüben**, rövid magyarázattal – a bemutatón ez mutatja a teljes rendszert.

## 7. Tanulság és újrahasznosítható prompt

- **Tanulság:** az egységteszt akkor válik hasznossá, amikor a *viselkedést* írja le („ékezet nélkül is találjon”), nem a megvalósítást.
- **Tanulság:** a típusos szótár és a `strict` TypeScript a szó szoros értelmében hibát fogott meg írás közben.
- **Újrahasznosítható prompt:** „Írj egy listanézetet úgy, hogy a szűrők az URL-ben élnek, a keresés ékezetfüggetlen, a lapozás és a rendezés is linkről működik, és az egész JavaScript nélkül is használható. A tiszta logikát tedd külön modulba, mert egységtesztelni fogom.”

## 8. Következő lépések

- [ ] ESLint + GitHub Actions CI (a bemutató nem függ tőle, a hosszú távú munka igen).
- [ ] Adatmodell + első migrációk (Drizzle), seed a valódi törzsadatokkal.
- [ ] Bejelentkezés és szerepkörök bekötése (D-0002), majd a jogosultsági modul tesztjei.
- [ ] A tokenek kontrasztjának és a mobilos nézetnek az ellenőrzése a bemutató előtt.

