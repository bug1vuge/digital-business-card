# Digital Business Card API

Backend-приложение цифровой визитки, разработанное на NestJS, TypeScript, GraphQL и Prisma.

Приложение предоставляет информацию о профиле разработчика, профессиональных навыках, опыте работы, проектах и профессиональных ссылках через GraphQL API.

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
- Git

## Features

- GraphQL API в Code First подходе
- профиль разработчика
- профессиональные ссылки
- список навыков
- опыт работы и достижения
- список проектов
- вложенные GraphQL relations
- CockroachDB через Prisma ORM
- Prisma migrations
- автоматическое заполнение базы данных
- Docker-окружение
- автоматическая подготовка базы при первом запуске
- health endpoint
- валидация environment variables
- unit и e2e тесты

## Quick Start

Для запуска всего приложения требуется Docker Desktop.

Клонируйте репозиторий:

```bash
git clone <repository-url>
cd digital-business-card
```

Запустите приложение:

```bash
docker compose up --build
```

После запуска будут доступны:

- Apollo Sandbox: http://localhost:3000/graphql
- Health check: http://localhost:3000/health
- CockroachDB Console: http://localhost:8080

При первом запуске Docker Compose автоматически:

1. запускает CockroachDB
2. создает базу `digital_business_card`
3. применяет Prisma migrations
4. заполняет базу начальными данными
5. запускает NestJS API

Дополнительная ручная подготовка базы данных не требуется.

## GraphQL Example

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

Пример сокращенного запроса:

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

GraphQL позволяет клиенту выбирать только необходимые поля.

## API

### GraphQL

```text
POST /graphql
```

Apollo Sandbox доступен по адресу:

```text
GET /graphql
```

### Health Check

```text
GET /health
```

Успешный ответ:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-07T00:00:00.000Z"
}
```

Если соединение с базой данных недоступно, endpoint возвращает HTTP `503 Service Unavailable`.

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

### Resolver

Отвечает за GraphQL API и передачу запросов в бизнес-слой.

### Service

Содержит логику получения данных и не зависит от GraphQL transport layer.

### PrismaService

Инкапсулирует доступ к Prisma Client и соединение с базой данных.

### Database

CockroachDB хранит профиль и связанные сущности.

## Database Structure

Основная модель:

```text
Profile
├── ProfessionalLink[]
├── Skill[]
├── Experience[]
└── Project[]
```

Внутренние поля базы данных не раскрываются автоматически через GraphQL.

Например:

```text
id
profileId
slug
sortOrder
createdAt
updatedAt
```

остаются внутренними полями приложения.

GraphQL schema определяется отдельно через Code First модели.

## Database Initialization

Для управления схемой используется Prisma Migrate.

В development:

```bash
npm run db:migrate
```

Для применения существующих миграций:

```bash
npm run db:deploy
```

Заполнение базы:

```bash
npm run db:seed
```

Проверка состояния миграций:

```bash
npm run db:status
```

Seed можно выполнять повторно без накопления дублирующихся данных.

## Local Development

Требования:

- Node.js 24+
- Docker Desktop
- npm

Установка зависимостей:

```bash
npm install
```

Запуск CockroachDB:

```bash
docker compose up -d cockroachdb cockroachdb-init
```

Применение миграций:

```bash
npm run db:deploy
```

Заполнение базы:

```bash
npm run db:seed
```

Запуск NestJS:

```bash
npm run start:dev
```

## Environment Variables

Пример находится в `.env.example`.

```env
DATABASE_URL="postgresql://root@localhost:26257/digital_business_card?sslmode=disable"
PORT=3000
NODE_ENV=development
```

Environment variables валидируются при запуске приложения.

Обязательная переменная:

```text
DATABASE_URL
```

Допустимые значения `NODE_ENV`:

```text
development
test
production
```

## Testing

Unit и integration/e2e тесты написаны с использованием Vitest.

Запуск всех тестов:

```bash
npm test
```

Запуск e2e тестов:

```bash
npm run test:e2e
```

Проверяются:

- ProfileService
- AppController
- `/health`
- GraphQL `profile` query

## Code Quality

Проверка линтером:

```bash
npm run lint
```

Проверка production build:

```bash
npm run build
```

## Docker Commands

Запустить:

```bash
npm run docker:up
```

Остановить:

```bash
npm run docker:down
```

Удалить контейнеры и базу данных:

```bash
npm run docker:reset
```

Посмотреть логи API:

```bash
npm run docker:logs
```

Для проверки полностью чистого запуска:

```bash
docker compose down -v
docker compose up --build
```

После этого миграции и seed выполняются автоматически.

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
├── Dockerfile
├── docker-compose.yml
├── prisma.config.ts
└── package.json
```

## Engineering Decisions

### GraphQL Code First

GraphQL schema описывается TypeScript-классами и декораторами NestJS.

Это позволяет использовать TypeScript как основной источник типов API и уменьшает дублирование между TypeScript и GraphQL schema.

### Separate GraphQL and Database Models

Prisma models и GraphQL models разделены.

Благодаря этому структура базы данных не определяет автоматически публичный API.

### CockroachDB

CockroachDB используется как основная реляционная база данных.

Для локальной разработки база запускается в single-node режиме через Docker.

`--insecure` используется только в локальном development-окружении.

### Prisma Adapter

Для соединения Prisma с CockroachDB используется PostgreSQL-совместимый драйвер через `@prisma/adapter-pg`.

### Explicit Module Dependencies

`PrismaModule` не является global module.

Модули, которым требуется доступ к данным, импортируют его явно.

Это делает зависимости модулей более прозрачными.

### Database Seed

Seed является повторно запускаемым.

Повторный запуск обновляет профиль и пересоздает связанные данные без накопления дубликатов.

### Docker Startup

Docker Compose контролирует последовательность запуска:

```text
CockroachDB
     |
     v
Database initialization
     |
     v
Prisma migrations
     |
     v
Database seed
     |
     v
NestJS API
```

Приложение запускается только после успешной подготовки базы данных.

## Author

Максим Малютин

GitHub: https://github.com/bug1vuge