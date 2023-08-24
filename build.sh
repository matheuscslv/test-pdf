git pull
npm install
npm run build
npm run typeorm migration:run
pm2 restart sisid-api-teste sisid-api-homologacao
