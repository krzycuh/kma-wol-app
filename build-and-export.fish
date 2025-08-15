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

echo "=== Rozpoczynam budowanie i eksport obrazu Docker ==="

# Upewnij się, że budujemy z katalogu repo (kontekst Dockera musi zawierać pliki w root)
set SCRIPT_DIR (dirname (status -f))
cd $SCRIPT_DIR

set IMAGE_NAME "kma-wol-app:latest"
set EXPORT_FILE "target/kma-wol-app-arm.tar"

# Krok 1: Tworzenie katalogu target
log_step "Tworzę katalog target"
mkdir -p target
if test $status -ne 0
    log_error "Nie udało się utworzyć katalogu target"
    exit 1
end
log_success "Katalog target utworzony pomyślnie"

# Krok 2: Konfiguracja buildx
log_step "Konfiguruję Docker buildx"
docker buildx create --use 2>/dev/null
if test $status -ne 0
    log_error "Nie udało się skonfigurować Docker buildx"
    exit 1
end
log_success "Docker buildx skonfigurowany pomyślnie"

# Krok 3: Budowanie obrazu
log_step "Buduję obraz Docker dla architektury ARM64"
log_step "Nazwa obrazu: $IMAGE_NAME"
log_step "Architektura: linux/arm64"
log_step "Cache: wyłączony"

run_command "docker buildx build --platform linux/arm64 -t $IMAGE_NAME --load --no-cache ."
log_success "Obraz Docker zbudowany pomyślnie"

# Krok 4: Eksport obrazu
log_step "Eksportuję obraz do pliku: $EXPORT_FILE"
run_command "docker save -o $EXPORT_FILE $IMAGE_NAME"
log_success "Obraz wyeksportowany pomyślnie do pliku $EXPORT_FILE"

echo "=== Proces zakończony pomyślnie ==="
log_success "Obraz zbudowany i zapisany do pliku $EXPORT_FILE" 