# KMA Wake-on-LAN App

Aplikacja do zdalnego uruchamiania komputerów przez Wake-on-LAN z podziałem na frontend i backend.

## Struktura projektu

```
kma-wol-app/
├── backend/             # Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts    # Główny plik serwera
│   └── ...
├── frontend/            # Frontend (React + Vite)
│   ├── public/          # Pliki statyczne (HTML, CSS, JS)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── ...
├── pnpm-workspace.yaml  # Konfiguracja workspace dla pnpm
├── docker-compose.yml
├── Dockerfile
├── README.md
└── ...
```

## Instalacja

### Wymagania wstępne

Przed uruchomieniem aplikacji upewnij się, że masz zainstalowane:

- **Node.js** (wersja 18 lub nowsza)
- **pnpm** (zalecane) lub npm

### Instalacja pnpm (zalecane)

```bash
# macOS (Homebrew)
brew install pnpm

# Lub przez npm
npm install -g pnpm
```

**Dlaczego pnpm?**
- **3x szybszy** niż npm przy instalacji zależności
- **Oszczędza miejsce** - współdzieli pakiety między projektami
- **Lepsze workspaces** - natywna obsługa monorepo
- **Bezpieczniejszy** - używa symlinków zamiast kopiowania plików
- **Lepszy cache** - bardziej efektywne zarządzanie cache'em

### Instalacja zależności

```bash
# Zainstaluj wszystkie zależności (pnpm)
pnpm install

# Lub używając npm:
npm run install:all

# Lub ręcznie:
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Uruchomienie

```bash
# Uruchom aplikację (pnpm)
pnpm start

# Lub w trybie development (wymaga nodemon)
pnpm run dev

# Lub używając npm:
npm start
npm run dev
```

## Konfiguracja

Utwórz plik `.env` w katalogu głównym z następującymi zmiennymi (uzywanymi przez npm start, przez dockera - nie):

```
TOKENS=token1->user1,token2->user2,token3->user3
COMPUTERS=computer1->mac1,computer2->mac2
```

## Dostęp

Aplikacja będzie dostępna pod adresem: `http://localhost:3000?token=YOUR_TOKEN`

## Przydatne skrypty

W projekcie dostępne są następujące skrypty (uruchamiaj z katalogu głównego, chyba że zaznaczono inaczej):

### Główne skrypty (package.json w katalogu głównym)

#### pnpm (zalecane)
- `pnpm start` – uruchamia backend w trybie produkcyjnym
- `pnpm run dev` – uruchamia backend w trybie developerskim (z hot-reload)
- `pnpm install` – instaluje zależności we wszystkich częściach projektu
- `pnpm run build` – kompiluje backend (TypeScript)
- `pnpm run build:all` – czyści, instaluje zależności i buduje backend
- `pnpm run clean` – usuwa katalogi node_modules i dist
- `pnpm run rebuild` – czyści, instaluje zależności i buduje backend
- `pnpm run rebuild:dev` – rebuild + uruchomienie w trybie developerskim
- `pnpm run rebuild:start` – rebuild + uruchomienie w trybie produkcyjnym
- `pnpm test` – uruchamia testy backendu
- `pnpm run test:unit` – testy jednostkowe backendu
- `pnpm run test:integration` – testy integracyjne backendu
- `pnpm run test:e2e` – testy end-to-end backendu
- `pnpm run test:coverage` – raport pokrycia testami
- `pnpm run test:watch` – testy w trybie watch

#### npm (alternatywa)
- `npm start` – uruchamia backend w trybie produkcyjnym
- `npm run dev` – uruchamia backend w trybie developerskim (z hot-reload)
- `npm run install:all` – instaluje zależności we wszystkich częściach projektu
- `npm run build` – kompiluje backend (TypeScript)
- `npm run build:all` – czyści, instaluje zależności i buduje backend
- `npm run clean` – usuwa katalogi node_modules i dist
- `npm run rebuild` – czyści, instaluje zależności i buduje backend
- `npm run rebuild:dev` – rebuild + uruchomienie w trybie developerskim
- `npm run rebuild:start` – rebuild + uruchomienie w trybie produkcyjnym
- `npm test` – uruchamia testy backendu
- `npm run test:unit` – testy jednostkowe backendu
- `npm run test:integration` – testy integracyjne backendu
- `npm run test:e2e` – testy end-to-end backendu
- `npm run test:coverage` – raport pokrycia testami
- `npm run test:watch` – testy w trybie watch

### Skrypty backend (w katalogu backend)

#### pnpm (zalecane)
- `pnpm start` – uruchamia backend (wymaga wcześniejszego builda)
- `pnpm run dev` – uruchamia backend z hot-reload (ts-node, nodemon)
- `pnpm run build` – kompiluje TypeScript do katalogu dist
- `pnpm test` – uruchamia wszystkie testy
- `pnpm run test:unit` – testy jednostkowe
- `pnpm run test:integration` – testy integracyjne
- `pnpm run test:e2e` – testy end-to-end
- `pnpm run test:coverage` – raport pokrycia testami
- `pnpm run test:watch` – testy w trybie watch

#### npm (alternatywa)
- `npm start` – uruchamia backend (wymaga wcześniejszego builda)
- `npm run dev` – uruchamia backend z hot-reload (ts-node, nodemon)
- `npm run build` – kompiluje TypeScript do katalogu dist
- `npm test` – uruchamia wszystkie testy
- `npm run test:unit` – testy jednostkowe
- `npm run test:integration` – testy integracyjne
- `npm run test:e2e` – testy end-to-end
- `npm run test:coverage` – raport pokrycia testami
- `npm run test:watch` – testy w trybie watch

### Skrypty frontend (w katalogu frontend)

#### pnpm (zalecane)
- `pnpm run dev` – uruchamia serwer deweloperski Vite
- `pnpm run build` – buduje frontend do katalogu dist
- `pnpm run preview` – podgląd zbudowanego frontendu

#### npm (alternatywa)
- `npm run dev` – uruchamia serwer deweloperski Vite
- `npm run build` – buduje frontend do katalogu dist
- `npm run preview` – podgląd zbudowanego frontendu

## Skrypty pomocnicze (fish)

W repozytorium znajdują się dwa skrypty ułatwiające budowanie i wdrażanie obrazu Dockera na Raspberry Pi (lub innym urządzeniu ARM):

### build-and-export.fish

- Buduje obraz Dockera dla architektury ARM64 (np. Raspberry Pi) z użyciem `docker buildx`.
- Wykorzystuje cache, by przyspieszyć kolejne buildy.
- Po zbudowaniu eksportuje obraz do pliku `target/kma-wol-app-arm.tar`.
- Użycie:
  ```
  ./build-and-export.fish
  ```
- Wymaga: Docker z włączonym buildx, shell fish.

### copy-and-load.fish

- Kopiuje zbudowany obraz (`kma-wol-app-arm.tar`) na zdalny serwer (np. Raspberry Pi) przez `scp`.
- Ładuje obraz do lokalnego Dockera na zdalnej maszynie przez `ssh` i usuwa plik po załadowaniu.
- Przed użyciem ustaw zmienne `RPI_USER` i `RPI_HOST` na użytkownika i adres docelowego urządzenia.
- Użycie:
  ```
  ./copy-and-load.fish
  ```
- Wymaga: skonfigurowanego dostępu SSH do docelowego urządzenia oraz shell fish.