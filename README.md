

# PokéHub v2 - responzivní verze
Web je dostupný na https://pokehub.majuki.tech
##  Použité technologie

* **HTML & CSS**: Struktura a basic stylování
* **Bootstrap 5.3**: Pro grid systém, responzivitu, modaly a základní komponenty (Carousel, Navbar).
* **Vanilla JavaScript (ES6+)**: Veškerá logika aplikace (košík, načítání produktů, filtrování) bez použití externích frameworků (jako React nebo Vue).
* **JSON**: Slouží jako "falešná" databáze pro produkty.

---

##  Architektura a klíčová rozhodnutí



### 1. Databáze bez backendu (JSON)
Namísto složité implementace SQL databáze a backendu (PHP/Node.js) projekt využívá soubor `data/produkty.json`.
* **Důvod:** Umožňuje to oddělit data od prezentace (HTML). Přidání nového produktu se dělá pouze úpravou jednoho JSON souboru, není nutné vytvářet nové HTML stránky.
* **Funkčnost:** JavaScript (`fetch API`) načte tento soubor a dynamicky vygeneruje kartičky produktů na hlavní stránce nebo detaily v košíku.

### 2. Dynamická stránka produktu (`produkt.html`)
Ačkoliv web vypadá, že má desítky stránek pro každý produkt, fyzicky existuje pouze jedna šablona: `produkt.html`.
* **Implementace:** Při kliknutí na produkt se do URL přidá parametr, např. `produkt.html?id=mega-etb`.
* **Logika:** Skript `js/produkt.js` si přečte tento parametr z URL (`URLSearchParams`), najde odpovídající objekt v `produkty.json` a doplní stránku (vymění obrázek, nadpis, cenu, popis a stav skladu).
* **Výhoda:** Obrovská úspora kódu a snadná údržba.

### 3. Nákupní košík v `localStorage`
Systém košíku je postaven na `window.localStorage`.
* **Důvod:** Protože nemáme serverové sessions, potřebujeme uchovat stav košíku i po obnovení stránky (F5) nebo při přechodu mezi stránkami.
* **Synchronizace:** Košík je globálně dostupný. Jakákoliv změna (přidání zboží) se okamžitě propíše do úložiště prohlížeče a aktualizuje indikátor v menu.

### 4. Logika skladové dostupnosti
Systém neukazuje pouze "Skladem/Neskladem", ale řeší 4 stavy, které se dynamicky renderují z JSON dat (`stock`, `instock`, `presell`, `soon`):
1.  **Skladem:** Ukazuje přesný počet kusů + "Dodání do 2-3 dnů".
2.  **Předprodej:** Zobrazuje varování, že zboží vyjde později (žlutý badge).
3.  **Brzy skladem:** Zboží je na cestě, ale nelze koupit.
4.  **Vyprodáno:** Tlačítko "Do košíku" zmizí nebo je neaktivní.

### 5. Gamifikace dopravy (Free Shipping Bar)
V modalu po přidání do košíku a v samotném košíku je implementován "Progress bar".
* **Účel:** Motivace uživatele k navýšení objednávky.
* **Logika:** JavaScript dynamicky počítá `(aktuální_cena / 5000) * 100` a mění šířku a barvu baru. Pokud je limit splněn, cena dopravy se automaticky přepíše na "Zdarma".

---

## 📂 Struktura projektu

```text
/
├── css/
│   ├── global.css       # Hlavní styly (barvy, fonty, resety)
│   └── ...              # Specifické CSS pro podstránky
├── data/
│   └── produkty.json    # "Databáze" všech produktů
├── img/                 # Obrázky produktů a loga
├── js/
│	├── produkty/
│		└── ... 		 # Logika pro doplnění stránek produktů
│   ├── cart.js          # Globální logika košíku (přidávání, modal, LS)
│   ├── index.js         # Logika pro domovskou stránku
│   └── produkt.js       # Logika pro detail produktu (URL parsing)
├── index.html           # Domovská stránka
├── produkt.html         # Univerzální šablona detailu produktu
├── kosik.html           # Nákupní košík a pokladna
└── ...                  # Ostatní statické stránky (grading, výkup)
