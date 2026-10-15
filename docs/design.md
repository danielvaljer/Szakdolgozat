# Design rendszer

> **Alapelv: a felület eszköz, nem dekoráció.** Egy leltáros ruhákat visz fel és ad ki, gyakran teli kézzel, telefonnal a raktárban. A felület akkor jó, ha nem kell magyarázni, és nem lassít.
>
> **Kapcsolódó döntés:** D-0004 (nincs külső letöltés, minden eszközön ugyanaz) – `docs/dontesek.md`. A betűtípus- és színválasztások ennek a keretnek a részei.

**Tartalom:** 0. Alapelvek · 1. Tokenek · 2. Szín-szemantika és állapotok · 3. Komponenskészlet · 4. Elrendezés és reszponzivitás · 5. Akadálymentesség · 6. Sötét mód · 7. Karbantartási szabályok · 8. Amit nem csinálunk · 9. Nyitott döntések

## 0. Alapelvek (ezek döntik el a vitákat)

1. **Tartalom az első.** A díszítés a tartalomtól vesz el helyet. Nincs gradiens, minta, illusztráció, díszanimáció.
2. **Semleges alap + egy akcentus.** A felület nagy része papírszerű semleges szín; színt csak az kap, ami **kivétel** vagy **cselekvés**.
3. **Csak a kivételek kapnak színt.** „Kiadható” (normál állapot) = semleges jelvény, nem zöld. Színes jelvény csak a figyelmet érdemlő állapotokra: kiadva, lejárt, sérült, elveszett. Így a szín valóban információt hordoz.
4. **Egy betűtípus, rendszerbetűkből.** Nincs letöltött webfont: nulla várakozás, nincs villanás, nincs külső szolgáltatás. A magyar `ő`/`ű` karakterek így is tökéletesek.
5. **Szemantikus tokenek, nem paletta-nevek.** `bg-surface`, `text-ink-muted`, `border-line` – nem `bg-stone-100`. A nyers színérték egyetlen fájlban él.
6. **Kevesebb variáns.** Egy elsődleges gomb, egy másodlagos, egy veszélyes. Nincs hat fajta kártya.
7. **Ugyanaz a komponens mobilon és asztalon.** Csak az elrendezés tér el (táblázat → kártyalista), a komponens és a logika nem duplikálódik.
8. **Animáció csak magyarázatként.** 120 ms, szín és átlátszóság. Semmi ugrálás, semmi `scale` hívogatás.

## 1. Tokenek – a design egyetlen igazságforrása

Minden érték **egyetlen fájlban** (`src/app/globals.css`) él. Új szín/térköz csak ott születhet, és ott is indoklással (kommentben).

**A minta (Tailwind CSS 4 CSS-first megoldás):** a `:root`-ban a világos értékek, a `.dark`-ban a sötétek, majd a `@theme inline` köti őket Tailwind segédosztályokhoz. Így a komponensekben **soha** nem kell `dark:` feltétel: a `bg-surface` mindkét módban helyes.

```css
/* src/app/globals.css */
@import "tailwindcss";

:root {
  color-scheme: light;
  --canvas:        oklch(0.985 0.004 85);   /* papír – meleg, nem hófehér */
  --surface:       oklch(1     0     0);    /* kártya, táblázat */
  --surface-muted: oklch(0.965 0.006 85);   /* fejlécsor, másodlagos panel */
  --line:          oklch(0.900 0.008 85);   /* elválasztó vonal – ez adja a szerkezetet */
  --ink:           oklch(0.250 0.012 60);   /* törzsszöveg – meleg tintához hasonló */
  --ink-muted:     oklch(0.520 0.012 60);   /* másodlagos szöveg, címke */
  --accent:        oklch(0.440 0.060 155);  /* mélyfenyő zöld: cselekvés, kijelölés */
  --accent-hover:  oklch(0.390 0.060 155);
  --on-accent:     oklch(0.990 0.010 155);
  --info:          oklch(0.500 0.110 250);  /* kiadva */
  --warning:       oklch(0.620 0.120 70);   /* határidő közeledik */
  --danger:        oklch(0.520 0.160 25);   /* hiba, elveszett, törlés */
  --success:       oklch(0.500 0.100 150);  /* sikeres mentés visszajelzése */
}

.dark {
  color-scheme: dark;
  --canvas:        oklch(0.190 0.008 60);
  --surface:       oklch(0.230 0.009 60);
  --surface-muted: oklch(0.270 0.010 60);
  --line:          oklch(0.330 0.010 60);
  --ink:           oklch(0.940 0.006 85);
  --ink-muted:     oklch(0.720 0.010 85);
  --accent:        oklch(0.720 0.070 155);
  --accent-hover:  oklch(0.780 0.070 155);
  --on-accent:     oklch(0.200 0.020 155);
  --info:          oklch(0.720 0.100 250);
  --warning:       oklch(0.780 0.110 70);
  --danger:        oklch(0.700 0.150 25);
  --success:       oklch(0.750 0.100 150);
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-line: var(--line);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-on-accent: var(--on-accent);
  --color-info: var(--info);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-success: var(--success);
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --radius-sm: 6px;                          /* űrlapmező, gomb, jelvény */
  --radius-md: 10px;                         /* kártya, panel, dialógus */
}
```

> Az értékek **kiindulási pontok** (szemre hangolandók a mintapéldányon), de a *nevek* és a *szerkezet* már most véglegesek. A hangolás így nem érinti a komponenseket.

### Tipográfiai skála (6 lépcső – nem 10)

| Token | Méret | Hol használjuk |
| --- | --- | --- |
| `text-xs` | 13 px | jelvény, metaadat (dátum, azonosító) |
| `text-sm` | 14 px | táblázat, űrlapcímke, másodlagos szöveg |
| `text-base` | 16 px | törzsszöveg, űrlapmező (mobilon ez alá nem megyünk) |
| `text-lg` | 18 px | szakaszcím |
| `text-xl` | 22 px | oldalcím |
| `text-2xl` | 28 px | összesítő szám az áttekintésen |

- **Egy család** (rendszerbetűk), súlyokból csak kettő: `400` (szöveg) és `600` (cím, kiemelés).
- Az azonosítók, méretek, darabszámok **tabuláris számjegyekkel** (`tabular-nums`), hogy a listákban egy vonalban álljanak.

### Térköz, méret, sugár

- **Térköz:** csak ezek használhatók: `4, 8, 12, 16, 24, 32, 48` px. Ez megakadályozza a „közel jó” elrendezéseket és a hatféle margint.
- **Vezérlő magasság:** 36 px asztali gépen, **44 px mobilon** (ujjal elérhető méret).
- **Sor magassága listában:** 44 px – ezzel a lista sűrű, de nem zsúfolt.
- **Sugár:** `rounded-sm` (6 px) űrlapon és gombon, `rounded-md` (10 px) panelen. Semmi más.
- **Árnyék:** összesen **egy** (`shadow-overlay`), kizárólag lebegő rétegen (dialógus, legördülő). A szerkezetet vonalak adják, nem árnyékok.
- **Elrendezési méretek:** oldalsáv 240 px, fejléc 56 px, tartalom maximális szélessége 1200 px, középre igazítva.

## 2. Szín-szemantika és állapotok

A ruha állapota **szöveges jelvény** (nem csak szín), mert a szín önmagában nem információ (színtévesztés, napsütés, rossz kijelző).

| Állapot | Jelvény szövege | Szín | Mikor |
| --- | --- | --- | --- |
| Kiadható | „Kiadható” | semleges (`surface-muted` + `line` keret) | alapállapot – ez a normál, ezért nincs színe |
| Kiadva | „Kiadva · Kovács Anna” | `info` | a ruhánál nyitott kölcsönzés van |
| Lejárt | „Kiadva · 3 napja lejárt” | `warning` | a határidő túllépve |
| Javításra vár | „Javításra vár” | semleges, szaggatott keret | sérülés miatt nem adható ki |
| Elveszett / selejt | „Elveszett” | `danger` | nem adható ki, és nem is kerül vissza |

- **Visszajelző üzenet (toast) csak két színnel:** `success` (mentés, kiadás sikerült) és `danger` (hiba). Semmi más.
- Az `accent` (mélyfenyő zöld) **kizárólag cselekvést** jelöl: elsődleges gomb, kijelölt menüpont, fókuszgyűrű. Nem díszítés.
- Egy képernyőn egyszerre legfeljebb **3 szín** látszik a semleges árnyalatok mellett.

## 3. Komponenskészlet

**Bázis (shadcn/ui – a kód a saját repóban van):** `Button`, `Input`, `Label`, `Select`, `Card`, `Table`, `Badge`, `Dialog`, `Sheet` (mobil fiók), `DropdownMenu`, `Skeleton`, `Sonner` (toast).

**Saját, projekt-szintű komponensek (ez a teljes lista – nem több):**

| Komponens | Feladata |
| --- | --- |
| `AppShell` | oldalsáv + fejléc + tartalom + mobil alsó sáv (az elrendezés egyetlen helyen) | ✅ kész |
| `PageHeader` | oldalcím, rövid leírás, jobbra az elsődleges művelet | ✅ kész |
| `Table`, `THead`, `Td`… | táblázat-elemek egy helyen (minden lista ugyanúgy néz ki) | ✅ kész |
| `GarmentTable` | a ruha-lista: asztalon sűrű táblázat, mobilon két soros sűrű sor | ✅ kész |
| `GarmentFilters` | keresés + 4 szűrő + „Szűrők +” panel; az URL-t írja | ✅ kész |
| `PaginationBar` | lapozás, találati darabszám | ✅ kész |
| `StatusBadge`, `ConditionBadge` | az állapot jelvénye – egy helyen a szín- és szöveglogika | ✅ kész |
| `EmptyState` | üres lista: egy mondat + a helyes következő lépés | ✅ kész |
| `Card`, `StatCard` | panel és összesítő kártya | ✅ kész |
| `Button` (`buttonClass`) | négy variáns, két méret – linkre is használható | ✅ kész |
| `ThemeToggle` | világos / sötét / rendszer | ✅ kész |
| `ComingSoon` | az elkészülő képernyők helye (a bemutatón hasznos) | ✅ kész |
| `ConfirmDialog` | visszavonhatatlan művelet megerősítése | november |
| `ImageDropzone` | kép feltöltés, előnézet, „ez a fő kép” | december |
| `TypeSuggest` | a képosztályozó javaslata + jóváhagyás | december |

**Gombok:** `primary` (accent), `secondary` (semleges felület + vonal), `ghost` (csak szöveg), `danger` (csak visszavonhatatlan műveletre). Két méret: `md` (36 / 44 px) és `sm` (32 px, táblázatsorban). **Nincs hatodik variáns.**

**Szabály új komponensre:** külön komponens csak akkor készül, ha **legalább két helyen** kell; addig helyben marad. Egy komponens egy fájl, ~150 sor alatt – ha hosszabb, bontani kell.

## 4. Elrendezés és reszponzivitás

**Három töréspont, kettő elrendezés:**

| Tartomány | Elrendezés |
| --- | --- |
| < 640 px (mobil) | fejléc + **alsó navigáció** (56 px) + egyhasábos tartalom; a lista két soros, sűrű sorokból áll – nem nagy kártyákból, mert egyszerre sok adatnak kell látszania |
| 640–1024 px (tablet) | fejléc + alsó navigáció, szélesebb egyhasábos tartalom |
| ≥ 1024 px (asztali) | **240 px oldalsáv** + fejléc + középre igazított tartalom (max 1200 px) |

- **A lista váltása törésponttal történik** (`hidden lg:block` / `lg:hidden`), nem JavaScript méretfigyeléssel: ugyanaz az adat két elrendezésben, egy komponensből. (CSS container query akkor lesz indokolt, ha a lista egy szűk panelben is megjelenik – addig felesleges bonyolítás.)
- **Űrlap:** egy hasáb mobilon, két hasáb 768 px felett, de a mezősor maximális hossza 640 px – a hosszú sorokat rossz olvasni.
- **Részletoldal:** asztalon két hasáb (balra adatok és képek, jobbra kölcsönzési előzmények és műveletek), mobilon egymás alatt, a műveletek felül.
- **Táblázat:** fejléc `surface-muted`, sor 44 px, soron belüli kiemelés `surface-muted`, az azonosítók **tabuláris számjegyekkel**.

## 5. Akadálymentesség (nem extra, hanem alap)

- **Kontraszt:** legalább AA (4.5:1). A tokenek ezt teljesítik; új szín csak mérés után kerülhet be.
- **Fókusz:** 2 px `accent` gyűrű minden billentyűzettel elérhető elemen. `outline: none` tilos.
- **Érintési méret:** legalább 44 × 44 px mobilon.
- **Címke mindig látható** (nem csak helykitöltő szöveg), a hiba a mező alatt, magyarul.
- **A szín soha nem egyedüli jelzés:** az állapot szöveges jelvény.
- **Űrlap:** `label for`, a hibánál `aria-invalid` és `aria-describedby`.
- **Dialógus és legördülő:** a Radix adja a billentyűzet-csapdát, az Esc kezelést és a fókusz visszaadását – ezért nem írunk sajátot.
- `prefers-reduced-motion` tisztelete.
- **Képek:** értelmes `alt` szöveg („ING-0042 piros mellény”), tisztán díszítő képnél üres `alt`.

## 6. Sötét mód

- A `<html>` elem `class="dark"` értékét a `next-themes` állítja. Alapértelmezés: **rendszer** (követi az operációs rendszert), a profilban felülírható.
- A komponensekben **nincs `dark:` feltétel** – a tokenek váltanak. Ha kivételesen mégis kell, indoklás kötelező kommentben.
- A sötét mód nem „negatív”: a háttér meleg sötétszürke (nem fekete), a szöveg nem hófehér – így hosszú használatnál sem fárasztó.
- Nincs „fehér villanás” betöltéskor: a témát a szerver már a HTML-be írja.

## 7. Karbantartási szabályok (hogy 3 hónap múlva is ez legyen az igazság)

1. Szín, térköz, sugár és betűméret **kizárólag** a `globals.css`-ből, szemantikus néven. Ha valahol „szín kell”, előbb token születik, aztán használat.
2. **Nincs tetszőleges Tailwind érték:** `mt-[13px]`, `bg-[#ff0000]`, `text-[15px]` tilos. Ha mégis kell, akkor hiányzik egy token – vagy rossz a terv.
3. Új komponens csak **két felhasználási helynél**; addig a megjelenítés a helyszínen marad.
4. Egy képernyőn legfeljebb **három vizuális szint** (oldalcím, szakaszcím, tartalom).
5. Formázás (dátum, méret, pénz, darabszám) egy helyről: `src/lib/format.ts` – nem szórjuk szét a komponensekben.
6. Minden komponens **mindkét módban** és **mobilon is** ellenőrizve (kész-definíció).
7. Vizuális változtatás és e dokumentum frissítése **ugyanabban a commitban** történik.
8. Ha egy szabály kellemetlen lesz, **itt** módosítjuk – nem csendben, a kódban megkerülve.

## 8. Amit nem csinálunk (tiltólista)

- gradiens, minta, illusztráció, dekorációs ikonhalmaz;
- árnyék a tartalmon (egy fajta árnyék, csak lebegő rétegen);
- letöltött webfont;
- animált oldalátmenet, parallax, mozgó háttér;
- kártya kártyában;
- hatnál több gombvariáns;
- `!important` és inline stílus (kivétel a CSS-változó értékadása);
- ikon szöveg nélkül ott, ahol műveletet jelöl (a jól ismert „×” zárás kivétel, tooltippel);
- skeleton mindenre – csak ahol valódi betöltés van;
- háromnál több szín egy képernyőn a semleges árnyalatokon kívül.

## 9. Nyitott döntések

- A téma `class` vagy `data-theme` attribútummal kapcsolódik? (mindkettő működik; a `class` a `next-themes` alapértéke, ezért marad a `class`.)
- Kell-e „sűrű” listamód a leltárosnak? – csak akkor, ha a használhatósági teszt igényli.
- Nyomtatási stíluslap a címkékhez (`print.css`) – november, a QR-funkcióval együtt.
- Alapértelmezett lapméret: 25 sor; 50 és 100 választható. Ha a valós használat más igényt mutat, ez itt módosul.
