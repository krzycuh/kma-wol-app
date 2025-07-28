# KMA Wake-on-LAN App

Aplikacja do zdalnego uruchamiania komputerów przez Wake-on-LAN z podziałem na frontend i backend.

## Struktura projektu

```
kma-wol-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts    # Główny plik serwera
│   └── ...
├── frontend/project/
│   ├── public/          # Pliki statyczne (HTML, CSS, JS)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── ...
├── docker-compose.yml
├── Dockerfile
├── README.md
└── ...
```

## Instalacja

```bash
# Zainstaluj wszystkie zależności
npm run install:all

# Lub ręcznie:
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Uruchomienie

```bash
# Uruchom aplikację
npm start

# Lub w trybie development (wymaga nodemon)
npm run dev
```

## Konfiguracja

Utwórz plik `.env` w katalogu głównym z następującymi zmiennymi (uzywanymi przez npm start, przez dockera - nie):

```
TOKENS=token1->user1,token2->user2
COMPUTERS=computer1->mac1,computer2->mac2
```

## Dostęp

Aplikacja będzie dostępna pod adresem: `http://localhost:3000?token=YOUR_TOKEN`

## Przydatne skrypty

W projekcie dostępne są następujące skrypty npm (uruchamiaj z katalogu głównego, chyba że zaznaczono inaczej):

### Główne skrypty (package.json w katalogu głównym)

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

- `npm start` – (placeholder) – frontend jest serwowany przez backend
- `npm run build` – (placeholder) – frontend jest statyczny

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