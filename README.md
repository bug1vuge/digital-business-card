# Digital Business Card API

Backend-приложение цифровой визитки, разработанное на NestJS, TypeScript, GraphQL, Prisma и CockroachDB.

API предоставляет информацию о профиле разработчика, профессиональных ссылках, навыках, опыте работы, достижениях и проектах.

## Live Demo

- Apollo Sandbox: https://digital-business-card-production-fd2e.up.railway.app/graphql
- Health Check: https://digital-business-card-production-fd2e.up.railway.app/health
- Source Code: https://github.com/bug1vuge/digital-business-card

## Technology Stack

- TypeScript
- Node.js 24+
- NestJS
- GraphQL
- Apollo Server
- Apollo Sandbox
- Prisma ORM
- CockroachDB
- PostgreSQL driver
- Docker
- Docker Compose
- Vitest
- Railway

## Features

- GraphQL API
- GraphQL Code First
- профиль разработчика
- профессиональные ссылки
- список навыков
- опыт работы
- достижения
- проекты
- вложенные GraphQL-сущности
- CockroachDB через Prisma ORM
- Prisma migrations
- автоматический database seed
- Docker-окружение
- автоматическая подготовка базы данных
- health check
- валидация environment variables
- unit tests
- e2e tests
- публичный deployment на Railway

## Quick Start

Для запуска проекта локально требуется Docker Desktop.

Клонируйте репозиторий:

```bash
git clone https://github.com/bug1vuge/digital-business-card.git
cd digital-business-card
```

Запустите приложение:

```bash
docker compose up --build
```

Docker Compose автоматически:

1. запускает CockroachDB
2. ожидает готовности базы данных
3. создает базу `digital_business_card`
4. применяет Prisma migrations
5. выполняет database seed
6. запускает NestJS API

После запуска доступны:

- Apollo Sandbox: http://localhost:3000/graphql
- Health Check: http://localhost:3000/health
- CockroachDB Console: http://localhost:8080

Дополнительная ручная подготовка базы данных для Docker-запуска не требуется.

## GraphQL

GraphQL endpoint:

```text
http://localhost:3000/graphql
```

Публичный endpoint:

```text
https://digital-business-card-production-fd2e.up.railway.app/graphql
```

При открытии endpoint в браузере доступен Apollo Sandbox.

### Example Query

```graphql
query {
  profile {
    name
    description

    links {
      label
      url
    }

    skills {
      name
    }

    experience {
      company
      position
      startDate
      endDate
      current
      achievements
    }

    projects {
      name
      description
      url
      repositoryUrl
    }
  }
}
```

Сокращенный запрос:

```graphql
query {
  profile {
    name

    skills {
      name
    }

    experience {
      company
      position
    }

    projects {
      name
    }
  }
}
```

GraphQL позволяет клиенту выбирать только необходимые поля ответа.

## Health Check

Endpoint:

```text
GET /health
```

Локально:

```text
http://localhost:3000/health
```

Публично:

```text
https://digital-business-card-production-fd2e.up.railway.app/health
```

Пример успешного ответа:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-08T15:16:44.000Z"
}
```

Health check выполняет запрос к базе данных.

Если CockroachDB недоступна, API возвращает:

```text
503 Service Unavailable
```

## Architecture

Приложение разделено на несколько уровней:

```text
GraphQL Request
      |
      v
ProfileResolver
      |
      v
ProfileService
      |
      v
PrismaService
      |
      v
Prisma ORM
      |
      v
CockroachDB
```

### ProfileResolver

Отвечает за GraphQL API и передачу запросов в service layer.

### ProfileService

Содержит логику получения профиля и связанных сущностей.

### PrismaService

Инкапсулирует Prisma Client, PostgreSQL adapter и управление соединением с базой данных.

### CockroachDB

Используется для хранения профиля, профессиональных ссылок, навыков, опыта работы и проектов.

## Database Structure

Основная структура данных:

```text
Profile
├── ProfessionalLink[]
├── Skill[]
├── Experience[]
└── Project[]
```

### Profile

Содержит:

- имя
- описание
- уникальный slug
- профессиональные ссылки
- навыки
- опыт работы
- проекты

### ProfessionalLink

Содержит профессиональные ссылки:

- GitHub
- Telegram
- Email

### Skill

Содержит список технологий и профессиональных навыков.

### Experience

Содержит:

- компанию
- должность
- дату начала работы
- дату окончания работы
- признак текущего места работы
- список достижений

### Project

Содержит:

- название
- описание
- URL проекта
- URL репозитория

## GraphQL and Database Models

Prisma models и GraphQL models разделены.

Prisma определяет структуру базы данных, а GraphQL models определяют публичный API.

Внутренние поля базы данных, например:

```text
id
profileId
slug
sortOrder
createdAt
updatedAt
```

не раскрываются через GraphQL, если они явно не добавлены в GraphQL model.

Такой подход позволяет независимо изменять внутреннюю структуру хранения данных и публичный GraphQL API.

## Database Initialization

Для управления схемой используется Prisma Migrate.

Создание migration в development:

```bash
npm run db:migrate
```

Применение существующих migrations:

```bash
npm run db:deploy
```

Заполнение базы:

```bash
npm run db:seed
```

Применение migrations и seed одной командой:

```bash
npm run db:setup
```

Проверка состояния migrations:

```bash
npm run db:status
```

Генерация Prisma Client:

```bash
npm run db:generate
```

Seed является повторно запускаемым и не создает наборы дублирующихся связанных данных.

## Local Development

### Requirements

- Node.js 24+
- npm
- Docker Desktop

Установите зависимости:

```bash
npm install
```

Создайте `.env` на основе `.env.example`:

```env
DATABASE_URL="postgresql://root@localhost:26257/digital_business_card?sslmode=disable"
PORT=3000
NODE_ENV=development
APP_PORT=3000
```

Запустите CockroachDB:

```bash
docker compose up -d cockroachdb cockroachdb-init
```

Примените migrations:

```bash
npm run db:deploy
```

Заполните базу:

```bash
npm run db:seed
```

Либо выполните оба шага одной командой:

```bash
npm run db:setup
```

Запустите NestJS:

```bash
npm run start:dev
```

API будет доступен по адресу:

```text
http://localhost:3000
```

## Environment Variables

Пример находится в:

```text
.env.example
```

Используемые переменные:

```env
DATABASE_URL="postgresql://root@localhost:26257/digital_business_card?sslmode=disable"
PORT=3000
NODE_ENV=development
APP_PORT=3000
```

### DATABASE_URL

Строка подключения к CockroachDB.

Переменная обязательна.

### PORT

Внутренний HTTP-порт NestJS.

По умолчанию:

```text
3000
```

### APP_PORT

Host-порт Docker Compose для доступа к приложению.

По умолчанию:

```text
3000
```

Например:

```env
APP_PORT=3100
```

позволит открыть приложение локально по адресу:

```text
http://localhost:3100
```

### NODE_ENV

Допустимые значения:

```text
development
test
production
```

Environment variables валидируются при запуске приложения.

## Testing

### Unit Tests

Unit-тесты не требуют запущенной базы данных.

Запуск:

```bash
npm test
```

Проверяются:

- AppController
- ProfileService

### E2E Tests

E2E-тесты проверяют настоящее приложение и требуют доступную CockroachDB.

При работающем Docker-окружении:

```bash
npm run test:e2e
```

Проверяются:

- `GET /health`
- GraphQL `profile` query
- взаимодействие NestJS с Prisma
- взаимодействие Prisma с CockroachDB

Unit и e2e тесты используют отдельные конфигурации Vitest.

## Code Quality

Запуск линтера:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Базовая проверка проекта:

```bash
npm run check
```

Команда выполняет:

```text
lint
unit tests
build
```

E2E-тесты запускаются отдельно, поскольку требуют доступную базу данных.

## Docker

Запуск:

```bash
npm run docker:up
```

Остановка:

```bash
npm run docker:down
```

Удаление контейнеров и database volume:

```bash
npm run docker:reset
```

Просмотр логов API:

```bash
npm run docker:logs
```

Полностью чистый запуск:

```bash
docker compose down -v
docker compose up --build
```

После удаления volume CockroachDB создается заново, Prisma migrations применяются автоматически, после чего выполняется database seed.

## Docker Services

Docker Compose содержит четыре сервиса:

```text
cockroachdb
cockroachdb-init
migrate
app
```

Последовательность запуска:

```text
CockroachDB
     |
     v
Database Health Check
     |
     v
Database Initialization
     |
     v
Prisma Migrations
     |
     v
Database Seed
     |
     v
NestJS API
```

Для локальной разработки используется CockroachDB `v25.4.4` в single-node режиме.

CockroachDB SQL port и Web Console привязаны к:

```text
127.0.0.1
```

Поэтому локальные порты базы данных не публикуются на внешних сетевых интерфейсах компьютера.

## Deployment

Публичная демонстрационная версия развернута на Railway.

Схема deployment:

```text
GitHub
   |
   v
Railway Build
   |
   v
Docker Image
   |
   v
Pre-deploy
   |
   +--> Prisma Migrations
   |
   +--> Database Seed
   |
   v
NestJS API
   |
   v
Railway Private Network
   |
   v
CockroachDB
```

Backend собирается из корневого `Dockerfile`.

Перед запуском новой версии приложения Railway выполняет:

```bash
npm run db:setup
```

Команда:

1. применяет Prisma migrations
2. выполняет database seed

Backend подключается к CockroachDB через private networking Railway.

Для Railway используется CockroachDB `v25.4.4`.

Публичные endpoints:

```text
https://digital-business-card-production-fd2e.up.railway.app/graphql
https://digital-business-card-production-fd2e.up.railway.app/health
```

## Project Structure

```text
digital-business-card/
├── prisma/
│   ├── migrations/
│   │   └── 20260907063044_init/
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── config/
│   │   └── env.validation.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── profile/
│   │   ├── models/
│   │   │   ├── experience.model.ts
│   │   │   ├── professional-link.model.ts
│   │   │   ├── profile.model.ts
│   │   │   ├── project.model.ts
│   │   │   └── skill.model.ts
│   │   │
│   │   ├── profile.constants.ts
│   │   ├── profile.module.ts
│   │   ├── profile.resolver.ts
│   │   ├── profile.service.spec.ts
│   │   └── profile.service.ts
│   │
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── test/
│   └── app.e2e.spec.ts
│
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── prisma.config.ts
├── package.json
├── vitest.config.ts
└── vitest.e2e.config.ts
```

## Engineering Decisions

### GraphQL Code First

GraphQL schema формируется из TypeScript-классов и декораторов NestJS.

Такой подход позволяет использовать TypeScript как основной источник типов GraphQL API.

### Separate GraphQL and Prisma Models

GraphQL models и Prisma models разделены.

Это позволяет независимо контролировать публичный API и структуру базы данных.

### Explicit Module Dependencies

`PrismaModule` не объявлен глобальным.

Модули, которым требуется доступ к Prisma, подключают его явно.

Это делает зависимости приложения более прозрачными.

### Deterministic Ordering

Связанные сущности содержат поле:

```text
sortOrder
```

API возвращает профессиональные ссылки, навыки, опыт и проекты в предсказуемом порядке.

### Database Seed

Seed используется для автоматической подготовки данных цифровой визитки.

Повторный запуск обновляет профиль и пересоздает связанные данные без накопления дублирующихся записей.

### Database Migrations

Изменения структуры базы данных хранятся в Prisma migrations.

Это позволяет воспроизводимо создавать одинаковую схему базы данных в локальном и deployment-окружениях.

### Docker Multi-stage Build

Dockerfile разделен на builder и production runner.

Builder отвечает за:

```text
dependency installation
Prisma Client generation
TypeScript build
```

Production runner содержит только необходимые runtime dependencies и собранное приложение.

Приложение запускается от непривилегированного пользователя `node`.

### Docker Startup

NestJS API запускается только после успешной подготовки CockroachDB.

Перед запуском приложения выполняются:

```text
database initialization
Prisma migrations
database seed
```

### CockroachDB

Для проекта используется CockroachDB `v25.4.4`.

Локальное окружение работает в single-node режиме через Docker Compose.

Для локальной разработки используется:

```text
--insecure
```

Backend в Railway взаимодействует с CockroachDB через private networking платформы.

## Available Scripts

### Application

```bash
npm run build
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
```

### Code Quality

```bash
npm run lint
npm run format
npm run check
```

### Tests

```bash
npm test
npm run test:watch
npm run test:cov
npm run test:debug
npm run test:e2e
```

### Database

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:setup
npm run db:status
```

### Docker

```bash
npm run docker:up
npm run docker:down
npm run docker:reset
npm run docker:logs
```

## Author

Максим Малютин

- GitHub: https://github.com/bug1vuge
- Repository: https://github.com/bug1vuge/digital-business-card