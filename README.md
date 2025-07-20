# KMA Wake-on-LAN App

Aplikacja do zdalnego uruchamiania komputerów przez Wake-on-LAN z podziałem na frontend i backend.

## Struktura projektu

```
project/
├── frontend/
│   ├── public/          # Pliki statyczne (HTML, CSS, JS)
│   └── src/             # Kod źródłowy frontendu (przyszłość)
├── backend/
│   ├── src/             # Kod źródłowy backendu (przyszłość)
│   └── server.js        # Główny plik serwera
└── package.json         # Workspace configuration
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

Utwórz plik `.env` w katalogu głównym z następującymi zmiennymi:

```
TOKENS=token1->user1,token2->user2
COMPUTERS=computer1->mac1,computer2->mac2
```

## Dostęp

Aplikacja będzie dostępna pod adresem: `http://localhost:3000?token=YOUR_TOKEN`