#!/usr/bin/env fish

# Ustaw IP lub hostname swojego RPi
# set RPI_USER "pi"
# set RPI_HOST "raspberrypi.local"  # lub np. 192.168.1.100
set TARGET_DIR "target/"
set RPI_DIR "kma-wol-app/"
set FILE_NAME "kma-wol-app-arm.tar"


# Skopiuj plik na RPi (do katalogu domowego)
echo "scp $TARGET_DIR$FILE_NAME $RPI_USER@$RPI_HOST:~/$RPI_DIR"
scp $TARGET_DIR$FILE_NAME $RPI_USER@$RPI_HOST:~/$RPI_DIR

# Połącz się z RPi i załaduj obraz do Dockera
echo "ssh $RPI_USER@$RPI_HOST \"docker load -i ~/$RPI_DIR$FILE_NAME && rm ~/$RPI_DIR$FILE_NAME\""
ssh $RPI_USER@$RPI_HOST "docker load -i ~/$RPI_DIR$FILE_NAME && rm ~/$RPI_DIR$FILE_NAME"

echo "Obraz załadowany na RPi!" 