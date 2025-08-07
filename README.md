# KMA Wake-on-LAN App

Aplikacja do zarządzania komputerami za pomocą Wake-on-LAN z nowoczesnym interfejsem webowym.

## Funkcje

- 🖥️ **Zarządzanie komputerami** - lista wszystkich skonfigurowanych komputerów
- ⚡ **Wake-on-LAN** - zdalne włączanie komputerów przez magiczne pakiety
- 🔐 **Autoryzacja** - system tokenów do bezpiecznego dostępu
- 📱 **Responsywny design** - działa na wszystkich urządzeniach
- 🎨 **Nowoczesny UI** - Material-UI + Tailwind CSS
- 📊 **Rozszerzalne karty** - miejsce na przyszłe funkcje monitorowania

## Technologie

### Frontend
- React 19
- TypeScript
- Material-UI (MUI)
- Tailwind CSS
- Vite

### Backend
- Node.js
- TypeScript
- Wake-on-LAN
- Jest (testy)

## Instalacja i uruchomienie

### Wymagania
- Node.js 18+
- pnpm

### Instalacja zależności
```bash
pnpm install
```

### Uruchomienie w trybie deweloperskim

#### Frontend i Backend jednocześnie
```bash
pnpm dev
```

#### Tylko Backend
```bash
pnpm --filter kma-wol-backend dev
```

#### Tylko Frontend
```bash
pnpm --filter kma-wol-frontend dev
```

### Budowanie aplikacji
```bash
pnpm build
```

### Uruchomienie w trybie produkcyjnym
```bash
pnpm start
```

## Konfiguracja

Aplikacja używa zmiennych środowiskowych do konfiguracji:

### Backend (.env)
```env
PORT=3000
TOKENS=token1->user1,token2->user2
COMPUTERS=computer1->mac1,computer2->mac2
```

### Przykład konfiguracji
```env
PORT=3000
TOKENS=abc123->admin,def456->user
COMPUTERS=server1->00:11:22:33:44:55,desktop->AA:BB:CC:DD:EE:FF
```

## Struktura projektu

```
kma-wol-app/
├── frontend/            # React aplikacja
│   ├── src/
│   │   ├── App.tsx      # Główny komponent
│   │   └── ...
│   └── package.json
├── backend/             # Node.js serwer
│   ├── src/
│   │   ├── config/      # Konfiguracja
│   │   ├── controllers/ # Logika biznesowa
│   │   ├── routes/      # Routing
│   │   └── ...
│   └── package.json
└── package.json         # Workspace root
```

## API Endpoints

### GET /api/computers
Zwraca listę dostępnych komputerów.

### GET /api/user
Zwraca informacje o zalogowanym użytkowniku.

### GET /api/wake?computer=name
Wysyła magiczny pakiet Wake-on-LAN do określonego komputera.

## Testy

```bash
# Wszystkie testy
pnpm test

# Testy jednostkowe
pnpm test:unit

# Testy integracyjne
pnpm test:integration

# Testy E2E
pnpm test:e2e

# Testy z coverage
pnpm test:coverage
```

## Docker

Aplikacja może być uruchamiana w kontenerach Docker:

```bash
docker-compose up
```

## Licencja

ISC