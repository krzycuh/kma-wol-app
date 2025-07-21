#!/usr/bin/env fish

mkdir -p target

set IMAGE_NAME "kma-wol-app:latest"
set EXPORT_FILE "target/kma-wol-app-arm.tar"

# Upewnij się, że masz buildx
docker buildx create --use 2>/dev/null

# Buduj obraz dla ARM64 i eksportuj do lokalnego dockera z cache
docker buildx build \
  --platform linux/arm64 \
  -t $IMAGE_NAME \
  --load \
  --cache-from=type=local,src=.buildx-cache \
  --cache-to=type=local,dest=.buildx-cache,mode=max \
  .

# Eksportuj obraz do pliku tar
docker save -o $EXPORT_FILE $IMAGE_NAME

echo "Obraz zbudowany i zapisany do pliku $EXPORT_FILE" 