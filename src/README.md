# A kód térképe

> Ez a fájl **a kódhoz szól**: megmutatja, hova nyúlj, ha valamit meg akarsz változtatni.
> A munkaszabályok az `AGENTS.md`-ben, a tervek a `docs/` mappában vannak.

## A szerkezet – négy hely, amit ismerned kell

| Hol | Mi van ott | Példa |
| --- | --- | --- |
| `src/app/` | **Képernyők.** Minden mappa egy URL. | `src/app/(app)/ruhak/page.tsx` → `/ruhak` |
| `src/components/` | **Megjelenítő elemek.** `ui/` = apró építőelemek, `layout/` = az oldalváza, `ruhak/` = a ruha-lista darabjai | `ui/button.tsx` |
| `src/lib/` | **Logika és szövegek** – itt nincs React: keresés, szűrés, formázás, magyar szövegek, mintaadatok | `lib/query.ts` |
| `src/app/globals.css` | **A design egyetlen igazságforrása** (színek, sötét mód) | `--accent` |

## Hova nyúlj, ha…

| Ezt akarod | Ezt nyisd meg |
| --- | --- |
| Színt, méretet, sötét módot változtatni | `src/app/globals.css` – **színhez csak itt nyúlj!** |
| Magyar szöveget átírni | `src/lib/i18n/hu.ts` – minden felhasználói szöveg egy helyen |
| Új menüpontot felvenni | `src/lib/nav.ts` |
| A ruha-lista oszlopait, kinézetét, lapozását | `src/components/ruhak/garment-table.tsx` |
| A keresést és a szűrőket (gyors szűrő + űrlap) | `src/components/ruhak/garment-filters.tsx` |
| A keresés/szűrés/lapozás **logikáját** | `src/lib/query.ts` (+ teszt: `src/lib/query.test.ts`) |
| Oldalsávot, fejlécet, mobil alsó sávot | `src/components/layout/*` |
| Új képernyőt létrehozni | új mappa a `src/app/(app)/` alatt, benne `page.tsx` |
| Mintaadatot | `src/lib/mock-data.ts` – **ideiglenes**, az adatbázisnál törlődik |
| A ruha/tag típusait (mezők) | `src/lib/types.ts` |

## Szavak, amiket a kódban látsz

| Írásmód | Jelentése |
| --- | --- |
| `export function Button()` | **Komponens**: egy darab felület, amit így használunk: `<Button />` |
| `{ query, counts }` (props) | A komponens **bemenete** – mint egy függvény paraméterei |
| `@/...` | Rövid út a `src/` mappához: `@/lib/format` = `src/lib/format.ts` |
| `"use client"` (fájl tetején) | Ez a fájl a **böngészőben** is lefut (téma-váltó, menü-kiemelés). Amelyiken nincs, az a szerveren fut – ez a jobb, mert kevesebb kód megy a telefonra |
| `érték ?? tartalék` | Ha az érték üres (`null`/`undefined`), akkor a tartalékot használja |
| `érték?.hossz` | „Ha az érték létezik, nézd meg; ha nem, ne hibázz” |
| `readonly Garment[]` | Olyan lista, amit a függvény nem módosíthat (véd a véletlen hibáktól) |
| `paginate<T>(lista)` | Generikus: „bármilyen típusú listára működik”, a `<T>` a lista elemének típusa |
| `as const` | „Ez az érték nem változik” – a szótárnál ez ad pontos típusokat |

## Öt szabály, amitől nem lesz káosz

1. **Egy tény, egy helyen.** Szín csak a `globals.css`-ben, szöveg csak a szótárban, formázás csak a `format.ts`-ben.
2. **Egy fájl = egy fogalom.** Ezért van egy fájlban minden jelvény (`ui/badge.tsx`), minden űrlapelem (`ui/form.tsx`) és a lista teljes szűrése (`garment-filters.tsx`).
3. **A képernyő vékony.** A `page.tsx` csak összeköt (adat → komponens); a logika a `lib/`-ben van.
4. **A szerver dolgozik.** Ha egy fájlon nincs `"use client"`, az a szerveren fut.
5. **Szöveget és színt nem írunk a képernyőbe.** Mindkettőnek megvan a maga helye.

## Parancsok

```bash
pnpm dev        # futtatás (http://localhost:3000)
pnpm typecheck  # TypeScript hibák keresése
pnpm test       # egységtesztek
```

Ha valamit nem értesz a kódban: minden fontos fájl tetején rövid magyarázat áll arról, miért úgy van, ahogy.
