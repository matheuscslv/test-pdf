# SISID API

## Rodando 
```yarn start:dev```

## Testando 
Criar `ormconfig.json` com os dados da base de dados para teste, exemplo em: `ormconfig.example`

Executar: ```yarn test```

## Relatório de cobertura dos testes 
https://api-sisid.msbtec.dev/tests/index.html

## Gerando Coverage
```NODE_ENV=development npx jest --coverage```

## Documentacao
https://documenter.getpostman.com/view/1706590/2s93sdYX5y

## Documentacao TypeORM
https://typeorm.io \
https://www.youtube.com/watch?v=9AO2hZJsHrs

### Criando migration
```yarn typeorm migration:create -n create-user```

### Executando os migrations
```yarn typeorm migration:run``` \
```yarn typeorm migration:revert```

### Executando seeds
```yarn seed```

### Executando build
```yarn build```

### Rodando build
Criar `ormconfig.json` com os dados da base de dados de produção, exemplo em: `ormconfig.production.example`
```node dist/server.js```

## Documentacao PM2
https://pm2.keymetrics.io

## Código de execução adicional
```sudo apt install qpdf```

https://docs.groupdocs.com/viewer/java/how-to-install-windows-fonts-on-ubuntu \

```
sudo apt-get install ttf-mscorefonts-installer \
sudo apt-get install fontconfig \
sudo fc-cache -f -v
```