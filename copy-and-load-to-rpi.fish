#!/usr/bin/env fish

# Funkcja do wypisywania kolorowych komunikatów
function log_step
    echo -e "\033[1;34m[KROK]\033[0m $argv"
end

function log_success
    echo -e "\033[1;32m[SUKCES]\033[0m $argv"
end

function log_error
    echo -e "\033[1;31m[BŁĄD]\033[0m $argv"
end

function log_warning
    echo -e "\033[1;33m[UWAGA]\033[0m $argv"
end

# Funkcja do wykonywania komend z obsługą błędów
function run_command
    set cmd $argv
    log_step "Wykonuję: $cmd"
    eval $cmd
    if test $status -ne 0
        log_error "Komenda zakończona niepowodzeniem: $cmd"
        exit 1
    end
end

# Funkcja pomocy
function show_help
    echo "Użycie: ./copy-and-load-to-rpi.fish <target> [opcje]"
    echo ""
    echo "Parametry:"
    echo "  target        Cel SSH w formacie:"
    echo "                - użytkownik@host (np. user@192.168.1.100, pi@raspberrypi.local)"
    echo "                - host (jeśli skonfigurowany w ~/.ssh/config, np. myserver)"
    echo ""
    echo "Opcje:"
    echo "  -h, --help    Wyświetl tę pomoc"
    echo ""
    echo "Przykłady:"
    echo "  ./copy-and-load-to-rpi.fish user@192.168.1.100"
    echo "  ./copy-and-load-to-rpi.fish pi@raspberrypi.local"
    echo "  ./copy-and-load-to-rpi.fish myserver"
    echo ""
    echo "Uwaga: Jeśli używasz tylko nazwy hosta, upewnij się że jest"
    echo "       skonfigurowany w ~/.ssh/config z odpowiednim użytkownikiem"
end

# Sprawdzenie parametrów
if test (count $argv) -eq 0; or contains -- --help $argv; or contains -- -h $argv
    show_help
    exit 0
end

if test (count $argv) -lt 1
    log_error "Brak parametru target!"
    echo ""
    show_help
    exit 1
end

echo "=== Rozpoczynam kopiowanie i ładowanie obrazu na RPi ==="

# Pobierz target z linii komend
set SSH_TARGET $argv[1]

# Sprawdź czy target zawiera @ (format użytkownik@host)
if string match -q "*@*" $SSH_TARGET
    # Podziel na użytkownika i host
    set parts (string split "@" $SSH_TARGET)
    set RPI_USER $parts[1]
    set RPI_HOST $parts[2]
else
    # Tylko host - użytkownik będzie określony przez SSH config lub domyślnie
    set RPI_USER ""
    set RPI_HOST $SSH_TARGET
    set SSH_TARGET $RPI_HOST
end

set TARGET_DIR "target/"
set RPI_DIR "docker-compose/"
set FILE_NAME "kma-wol-app-arm.tar"

log_step "Konfiguracja:"
if test -n "$RPI_USER"
    log_step "  Target SSH: $RPI_USER@$RPI_HOST"
    log_step "  Użytkownik: $RPI_USER"
    log_step "  Host: $RPI_HOST"
else
    log_step "  Target SSH: $SSH_TARGET"
    log_step "  Host: $RPI_HOST (użytkownik z SSH config)"
end
log_step "  Katalog lokalny: $TARGET_DIR"
log_step "  Katalog zdalny: $RPI_DIR"
log_step "  Nazwa pliku: $FILE_NAME"

# Krok 1: Sprawdzenie czy plik istnieje lokalnie
log_step "Sprawdzam czy plik $TARGET_DIR$FILE_NAME istnieje"
if not test -f $TARGET_DIR$FILE_NAME
    log_error "Plik $TARGET_DIR$FILE_NAME nie istnieje!"
    log_warning "Uruchom najpierw skrypt build-and-export.fish"
    exit 1
end
log_success "Plik $TARGET_DIR$FILE_NAME znaleziony"

# Krok 2: Kopiowanie pliku na RPi
log_step "Kopiuję plik na RPi do katalogu ~/$RPI_DIR"
run_command "scp $TARGET_DIR$FILE_NAME $SSH_TARGET:~/$RPI_DIR"
log_success "Plik skopiowany pomyślnie na RPi"

# Krok 3: Ładowanie obrazu do Dockera na RPi i usuwanie pliku
log_step "Ładuję obraz do Dockera na RPi i usuwam plik tar"
run_command "ssh $SSH_TARGET \"docker load -i ~/$RPI_DIR$FILE_NAME && rm ~/$RPI_DIR$FILE_NAME\""
log_success "Obraz załadowany do Dockera na RPi"
log_success "Plik tar usunięty z RPi"

# Krok 4: Restart kontenera z nową wersją
log_step "Restartuję kontener kma-wol-app z nową wersją obrazu"
run_command "ssh $SSH_TARGET \"cd ~/$RPI_DIR && docker compose up -d --force-recreate kma-wol-app\""
log_success "Kontener kma-wol-app zrestartowany z nową wersją"

echo "=== Proces zakończony pomyślnie ==="
log_success "Obraz zbudowany, skopiowany, załadowany i wdrożony na RPi!"