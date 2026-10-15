1. **Szakdolgozat tématerv** 

***Leltározó webes felület fejlesztése néptáncegyesületi ruhakölcsönzés támogatására***

***Development of an Inventory Management Web Application for Supporting Folk Dance Costume Lending***

**Szakdolgozó neve:** 	Valjer Dániel  
**EHA/Neptun kód:**     	QYIC5A  
**Szak:** 		programtervező informatikus BSc  
**Tagozat:** 		nappali

**A dolgozat típusa (Szakdolgozat/Diplomamunka):** Szakdolgozat

**Témavezető:** Dr. Jánki Zoltán Richárd

**A szakdolgozat tárgya**

Az egyesületek, alapítványok és kisebb közösségek működése során gyakran kezelnek jelentős értékű anyagi eszközöket \- például felszereléseket, díszleteket vagy éppen jelmezeket \-, amelyek nyilvántartása jellemzően manuális, táblázatkezelő programokkal vagy papír alapú formában történik. Ez a megoldás azonban hosszú távon hibalehetőségeket rejt: nehezen deríthető fel, hogy egy adott darab hol van, kinek adják ki, milyen állapotban, illetve az egyesület teljes vagyonáról naprakész képet csak jelentős kézi munkával lehet kapni.   
A szakdolgozat célja egy webalapú leltározó és ruhakiadó kezelőfelület megtervezése és megvalósítása, amely közvetlen felhasználói igény alapján, egy néptáncegyesület ruhakészletének nyilvántartására készül. A megoldás azonban tudatosan általános felépítésű, így más, hasonló problémával küzdő közösségek (pl. színjátszó csoportok, sportegyesületek, iskolák) is használhatják kisebb testreszabással.  
A rendszer alapvető feladata a ruhaállomány strukturált nyilvántartása. A ruhák egyedi azonosítóval (pl. sorozatszám, akár QR- vagy vonalkód) rendelkeznek, és ruhatípushoz (pl. ing, mellény, szoknya), tájegységhez (pl. palóc, matyó, kalotaszegi), állapothoz és mérethez kötődnek. Az egyesületi tagok nyilvántartása mellett a rendszer támogatja a ruhák kiadását és visszavételét, valamint minden művelet naplózását, így bármikor visszakövethető, hogy melyik darab melyik tagnál van, vagy mikor adták ki és vették vissza.  
A felhasználók regisztrációval és különböző jogosultsági szintekkel használhatják a felületet: az adminisztrátor teljes körűen kezelheti az adatokat, a leltáros kiadást, felvitelt, eltávolítást végezhet a ruhák kezelése felett, míg a tagok elsősorban a saját kiadás- és visszavételi tevékenységüket láthatják. A jogosultsági modell alapvető biztonsági és adatvédelmi szempontokat is figyelembe vesz.  
	A rendszer különleges eleme a képfeldolgozásra építő automatikus felismerés: egy ruhadarab fényképének feltöltésekor a rendszer gépi tanuláson alapuló képosztályozóval meghatározza, hogy a képen milyen típusú ruhadarab látható (pl. ing, mellény, szoknya), és ennek alapján automatikusan beállítja a ruhatípust. Hosszabb távon a tájegységek sajátosságainak felmérésével a rendszer a ruha származási helyére (tájegységére) is tehet javaslatot. A felismerés nem kizárólagos döntéshozó, hanem javaslatot ad, amelyet a felhasználó megerősíthet vagy módosíthat \- ezzel a hibás automatikus besorolás kockázata kezelhető marad.  
	A szakdolgozat nem kizárólag az egyes funkciók megvalósítására koncentrál, hanem bemutatja egy teljes kliens-szerver alapú webes rendszer tervezését és elkészítését is: az adatmodell és adatbázis tervezését, a felhasználói felület kialakítását, a jogosultságkezelést, a képfeldolgozó modell betanítását és integrálását, továbbá a naplózás és a hibakezelés megvalósítását. Fontos cél a könnyen használható, átlátható kezelőfelület, a stabil működés, a reszponzív megjelenés (asztali gépen és mobilon egyaránt), valamint a későbbi továbbfejleszthetőség.  
	A fejlesztés eredményeként egy működő prototípus létrehozása a cél, amely bemutatja a leltárkezelés teljes munkafolyamatát az adatrögzítéstől a kiadás-visszavételen át a naplózásig, és képes a ruhaképek automatikus típusfelismerésére. A rendszer később további funkciókkal bővíthető: például QR-címkék és mobilon történő beolvasás, ruhastatisztikák és riportok, kölcsönzési határidők kezelése, e-mail értesítések, több egyesület (multi-tenant) támogatása vagy a tájegység-javaslat pontosítása.  
	

**Alkalmazott technológiák:**

* **Web-alkalmazás**  
  * React / Vue / Angular, Typescript / JavaScript (a kutatási fázisban véglegesítendő)

* **Backend**  
  * Keretrendszer, nyelv: pl. ASP.NET Core (C\#) / Node.js / Django (Python) (a kutatási fázisban véglegesítendő)  
  * Adatbázis: pl. PostgreSQL / MySQL / SQLite (a kutatási fázisban véglegesítendő)  
  * Képfeldolgozás: pl. Python alapú gépi tanulási könyvtárak (TensorFlow / PyTorch), CNN-alapú képosztályozó modell (a kutatási fázisban véglegesítendő)

**Részletes ütemterv**

2026\. szeptember – Kutatás és technológiai alapozás  
\- Funkcionális és nem funkcionális követelmények összeállítása  
\- Kliensoldali, szerveroldali és adatbázis-technológiák összehasonlítása  
\- Képfelismerési megoldások vizsgálata (kész modellek, transfer learning, saját modell betanítása)  
\- A rendszer magas szintű architektúrájának megtervezése

2026\. október – Adatmodell és alapfunkciók  
\- Az adatmodell részletes megtervezése (tagok, ruhák, ruhatípusok, tájegységek, kiadás–visszavétel, naplóbejegyzések)  
\- Egyedi azonosítók generálásának megtervezése és megvalósítása  
\- Regisztrációs és bejelentkezési rendszer elkészítése  
\- Jogosultsági szintek (adminisztrátor, leltáros, tag) megtervezése és megvalósítása  
\- Tagok, ruhatípusok és tájegységek kezelőfelületének elkészítése  
\- Ruhák felvétele, módosítása és törlése  
\- Alapvető navigáció és kezelőfelület kialakítása  
\- Az adatkezelési logika egységtesztjeinek elkészítése

2026\. november – Kiadás-visszavétel és naplózás  
\- Ruha kiadása egy tagnak (kiadási folyamat, állapotváltás)  
\- Ruhák visszavétele (állapot megjelölése, esetleges sérülés rögzítése)  
\- Teljes műveleti naplózás kialakítása (ki hozta létre, módosította, kiadta, vette vissza)  
\- Napló megjelenítése és szűrése a felületen  
\- Keresés és szűrés ruhákra és tagokra nézve  
\- A ruhák aktuális státuszának megjelenítése (kiadható / kiadva / visszavéve)  
\- Hibakezelés és szerveroldali validáció kialakítása

2026\. december – Képfeldolgozás és automatikus felismerés  
\- Tréning adathalmaz összeállítása (ruhatípusonkénti képek gyűjtése)  
\- Képosztályozó modell betanítása és kiértékelése (pontosság, téves besorolás vizsgálata)  
\- A modell integrálása a backendbe, képfeltöltési végpont kialakítása  
\- A javaslat-megerősítés munkafolyamat megvalósítása (a felhasználó jóváhagyja a típust)  
\- Képek tárolása és megjelenítése a ruhák mellett  
\- Tájegység-javaslat felmérése (első lépésben lehetőségként, későbbi bővítésként)  
\- Szerveroldali naplózás és hibakövetés kialakítása

2027\. január – Tesztelés és minőségbiztosítás  
\- Egységtesztek bővítése  
\- Kliens-szerver integrációs tesztek elkészítése  
\- Teljes munkafolyamatok automatizált vizsgálata (regisztráció, ruha felvétele, kiadás. visszavétel, napló)  
\- A képfelismerés pontosságának mérése valós képeken  
\- Tesztelés különböző böngészőkben és képernyőméreteken (asztali gép, mobil)  
\- Teljesítmény- és terhelésvizsgálat  
\- Adatbiztonsági ellenőrzések (jogosultságok, jelszókezelés)  
\- Használhatósági tesztelés az egyesület tagjaival  
\- A feltárt hibák osztályozása és javítása  
\- Tesztelési jegyzőkönyv és mérési eredmények összeállítása

2027\. február – Véglegesítés és a dolgozat megkezdése  
\- Kritikus hibák javítása  
\- Felhasználói felület és felhasználói élmény finomhangolása  
\- Telepítési és üzemeltetési folyamat véglegesítése  
\- Adatbázis-mentési és helyreállítási lehetőségek kialakítása  
\- Felhasználói és fejlesztői dokumentáció elkészítése  
\- Képernyőképek, architektúra-ábrák és diagramok elkészítése  
\- A dolgozat részletes tartalomjegyzékének összeállítása  
\- A bevezetés, követelményelemzés és technológiai áttekintés megírása

2027\. március – Tervezési és megvalósítási fejezetek  
\- A rendszerarchitektúra dokumentálása  
\- Az adatmodell és a képfeldolgozási folyamat bemutatása  
\- A jogosultságkezelés ismertetése  
\- A kiadás-visszavétel munkafolyamatának dokumentálása  
\- A képosztályozó modell betanításának és beépítésének bemutatása  
\- Fontosabb tervezési döntések és alternatívák indoklása  
\- Ábrák, folyamatdiagramok és kódrészletek beillesztése  
\- Folyamatos szakmai és nyelvi felülvizsgálat

2027\. április – Tesztelési fejezet és teljes kézirat  
\- A tesztelési módszerek és környezet bemutatása  
\- A funkcionális, teljesítmény- és felhasználói tesztek dokumentálása  
\- A képfelismerési mérések eredményeinek kiértékelése  
\- A rendszer korlátainak és továbbfejlesztési lehetőségeinek összegyűjtése  
\- Összegzés elkészítése  
\- Teljes kézirat egységesítése  
\- Konzulensi visszajelzések feldolgozása  
\- Hivatkozások, ábrajegyzék, táblázatjegyzék és mellékletek ellenőrzése

2027\. május – Véglegesítés és leadás  
\- Szakmai, nyelvi és formai hibák javítása  
\- Követelményeknek megfelelő tördelés  
\- Hivatkozások és forrásjegyzék végső ellenőrzése  
\- Ábrák, táblázatok és mellékletek ellenőrzése  
\- Plágium- és helyesírás-ellenőrzés  
\- Az alkalmazás végleges verziójának archiválása  
\- Forráskód, telepítési útmutató és bemutatóanyag rendezése  
\- A szakdolgozat végleges exportálása és leadása  
\- Prezentáció és védési demonstráció előkészítése

**Tervezett funkciók**

*Alapvető funkciók*  
\- Regisztrációs és bejelentkezési rendszer  
\- Többféle jogosultsági szint (adminisztrátor, leltáros, tag)  
\- Egyesületi tagok kezelése (felvétel, módosítás, deaktiválás)  
\- Ruhatípusok és tájegységek kezelése (létrehozás, módosítás, törlés)  
\- Ruha felvétele egyedi, automatikusan generált azonosítóval  
\- Ruha állapotának és méretének rögzítése  
\- Ruha kiadása és visszavétele (állapotváltással együtt)  
\- Tevékenységek naplózása (ki, mikor, mit csinált)  
\- Keresés és szűrés ruhákra és tagokra  
\- Ruha képeinek feltöltése és megjelenítése  
\- Képfeldolgozás alapú automatikus ruhatípus-felismerés (javaslat \+ felhasználói megerősítés)  
\- Reszponzív, különböző képernyőméretekhez alkalmazkodó felület

*Kiegészítő funkciók*  
\- Tájegység-javaslat a ruha származási helyére (a tájegységek sajátosságai alapján)  
\- QR- vagy vonalkód-alapú azonosítás mobilon történő beolvasással  
\- Statisztikák és riportok (leggyakrabban kiadott ruhák, kiadások száma tagonként)  
\- Kölcsönzési határidők és késedelmi értesítések  
\- E-mail értesítések (pl. visszavétel esedékessége)  
\- Nyomtatható címkék (azonosítóval és QR-kóddal)  
\- Sérülés, elhasználódás rögzítése megjegyzéssel  
\- Világos és sötét megjelenési mód  
\- Többnyelvű felhasználói felület  
\- Több egyesület (multi-tenant) támogatása  
\- Offline mód, későbbi szinkronizálással  
\- Adatexportálás (CSV, PDF lista)  
\- Szerveroldali naplózás és hibakövetés kialakítása  
