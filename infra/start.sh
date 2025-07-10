#!/bin/bash

echo "🔥 Iniciando a Infraestrutura Viva do Klyro..."
cd "$(dirname "$0")"

docker-compose down
docker-compose build
docker-compose up -d

echo "✅ Infraestrutura no ar!"
echo "🌐 API: http://localhost:3000"
echo "🤖 Classificador: http://localhost:5000"
echo "📈 Monitoramento: http://localhost:9090"
