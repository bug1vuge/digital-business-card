# Digital Business Card API

Backend-приложение цифровой визитки на NestJS, TypeScript, GraphQL, Prisma и CockroachDB.

API предоставляет информацию о профиле разработчика, профессиональных ссылках, навыках, опыте работы, достижениях и проектах.

## Technology Stack

- TypeScript
- Node.js
- NestJS
- GraphQL
- Apollo Server
- Apollo Sandbox
- Prisma ORM
- CockroachDB
- Docker
- Docker Compose
- Vitest

## Features

- GraphQL API
- GraphQL Code First
- профиль разработчика
- профессиональные ссылки
- навыки
- опыт работы
- достижения
- проекты
- вложенные GraphQL-сущности
- Prisma ORM
- CockroachDB
- Prisma migrations
- автоматический seed базы данных
- Docker-окружение
- автоматическая подготовка базы при запуске
- health check
- валидация environment variables
- unit tests
- e2e tests

## Quick Start

Для запуска приложения требуется Docker Desktop.

Клонируйте репозиторий:

```bash
git clone https://github.com/bug1vuge/digital-business-card.git
cd digital-business-card
```

Запустите приложение:

```bash
docker compose up --build
```

После запуска будут доступны:

- Apollo Sandbox: http://localhost:3000/graphql
- Health Check: http://localhost:3000/health
- CockroachDB Console: http://localhost:8080

Docker Compose автоматически:

1. запускает CockroachDB
2. ожидает готовности базы данных
3. создает базу `digital_business_card`
4. применяет Prisma migrations
5. выполняет database seed
6. запускает NestJS API

Дополнительная ручная подготовка базы данных для Docker-запуска не требуется.

## GraphQL

GraphQL endpoint:

```text
http://localhost:3000/graphql
```

После открытия адреса в браузере доступен Apollo Sandbox.

Пример запроса:

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

Сокращенный пример:

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

Пример успешного ответа:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-07T00:00:00.000Z"
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

Отвечает за GraphQL API и передачу запроса в service layer.

### ProfileService

Содержит логику получения профиля и связанных сущностей.

### PrismaService

Инкапсулирует Prisma Client и управление соединением с базой данных.

### CockroachDB

Используется для хранения профиля, навыков, опыта работы, проектов и профессиональных ссылок.

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
- связанные ссылки
- навыки
- опыт работы
- проекты

### ProfessionalLink

Содержит профессиональные ссылки пользователя:

- GitHub
- Telegram
- Email

### Skill

Содержит список технологий и навыков.

### Experience

Содержит:

- компанию
- должность
- дату начала
- дату окончания
- признак текущего места работы
- достижения

### Project

Содержит:

- название
- описание
- URL проекта
- URL репозитория

## GraphQL and Database Models

Prisma models и GraphQL models разделены.

Prisma отвечает за структуру базы данных, а GraphQL models определяют публичный API.

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

Проверка состояния migrations:

```bash
npm run db:status
```

Генерация Prisma Client:

```bash
npm run db:generate
```

Seed можно выполнять повторно без накопления дублирующихся связанных данных.

## Local Development

Требования:

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

Запустите NestJS:

```bash
npm run start:dev
```

API будет доступен по адресу:

```text
http://localhost:3000
```

## Environment Variables

Пример environment variables находится в:

```text
.env.example
```

Используемые переменные:

```env
DATABASE_URL="postgresql://root@localhost:26257/digital_business_card?sslmode=disable"
PORT=3000
NODE_ENV=development
```

### DATABASE_URL

Строка подключения к CockroachDB.

Переменная обязательна.

### PORT

Порт HTTP-сервера.

По умолчанию:

```text
3000
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

При запущенном Docker-окружении:

```bash
npm run test:e2e
```

Проверяются:

- `GET /health`
- GraphQL `profile` query
- взаимодействие NestJS с Prisma и CockroachDB

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

E2E-тесты запускаются отдельно, поскольку требуют базу данных.

## Docker

Запуск приложения:

```bash
npm run docker:up
```

Остановка:

```bash
npm run docker:down
```

Удаление контейнеров и volume базы данных:

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

После удаления volume база создается заново, Prisma migrations применяются автоматически, после чего выполняется seed.

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

CockroachDB SQL port и Web Console локально привязаны к:

```text
127.0.0.1
```

и не публикуются на внешних сетевых интерфейсах компьютера.

## Project Structure

```text
digital-business-card/
├── prisma/
│   ├── migrations/
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

Такой подход позволяет использовать TypeScript как источник типов GraphQL API.

### Separate GraphQL and Prisma Models

GraphQL models и Prisma models разделены.

Это позволяет независимо контролировать публичный API и структуру базы данных.

### Explicit Module Dependencies

`PrismaModule` не объявлен глобальным.

Модули, которым требуется Prisma, подключают его явно.

Это делает зависимости приложения более прозрачными.

### Deterministic Ordering

Связанные сущности содержат `sortOrder`.

API возвращает:

- ссылки
- навыки
- опыт
- проекты

в предсказуемом порядке.

### Database Seed

Seed предназначен для автоматической подготовки данных цифровой визитки.

Повторный запуск обновляет профиль и пересоздает связанные сущности, не создавая наборы дублирующихся записей.

### Docker Startup

NestJS API запускается только после успешной подготовки CockroachDB.

Перед запуском приложения выполняются:

```text
database initialization
Prisma migrations
database seed
```

### CockroachDB Development Mode

Локальный Docker Compose использует CockroachDB в single-node режиме.

Параметр:

```text
--insecure
```

предназначен только для локального development/demo окружения.

Для публичного deployment используется защищенное подключение к внешней базе данных.

## Available Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod

npm run lint
npm run format

npm test
npm run test:watch
npm run test:cov
npm run test:e2e

npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:status

npm run docker:up
npm run docker:down
npm run docker:reset
npm run docker:logs

npm run check
```

## Author

Максим Малютин

GitHub: https://github.com/bug1vuge