#!/bin/sh
set -e

echo "Gerando a build do imagem: ia-core ..."
cd ./ia-core
./build-image.sh

echo "Gerando a build do imagem: ia-server ..."
cd ..
cd ./ia-server
./build-image.sh

echo "Gerando a build do imagem: backend ..."
cd ..
cd ./backend
./build-image.sh

echo "Gerando a build do imagem: frontend ..."
cd ..
cd ./frontend
./build-image.sh

echo "Geração das imangens finalizada."