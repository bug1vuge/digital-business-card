import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const PROFILE_SLUG = 'maksim-malyutin';

async function main(): Promise<void> {
  const profile = await prisma.profile.upsert({
    where: {
      slug: PROFILE_SLUG,
    },
    update: {
      name: 'Максим Малютин',
      description:
        'Frontend-разработчик с 4+ годами коммерческого опыта в разработке веб-приложений, административных панелей и интерактивных интерфейсов. Основной стек - TypeScript, JavaScript и React. Есть опыт интеграции frontend с backend-сервисами, работы с базами данных, Node.js, Docker и GraphQL.',
    },
    create: {
      slug: PROFILE_SLUG,
      name: 'Максим Малютин',
      description:
        'Frontend-разработчик с 4+ годами коммерческого опыта в разработке веб-приложений, административных панелей и интерактивных интерфейсов. Основной стек - TypeScript, JavaScript и React. Есть опыт интеграции frontend с backend-сервисами, работы с базами данных, Node.js, Docker и GraphQL.',
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.professionalLink.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.skill.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.experience.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.project.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.professionalLink.createMany({
      data: [
        {
          label: 'GitHub',
          url: 'https://github.com/bug1vuge',
          sortOrder: 1,
          profileId: profile.id,
        },
        {
          label: 'Telegram',
          url: 'https://t.me/develop_3r',
          sortOrder: 2,
          profileId: profile.id,
        },
        {
          label: 'Email',
          url: 'mailto:malutinm11@gmail.com',
          sortOrder: 3,
          profileId: profile.id,
        },
      ],
    });

    await tx.skill.createMany({
      data: [
        {
          name: 'TypeScript',
          sortOrder: 1,
          profileId: profile.id,
        },
        {
          name: 'JavaScript',
          sortOrder: 2,
          profileId: profile.id,
        },
        {
          name: 'React',
          sortOrder: 3,
          profileId: profile.id,
        },
        {
          name: 'Node.js',
          sortOrder: 4,
          profileId: profile.id,
        },
        {
          name: 'GraphQL',
          sortOrder: 5,
          profileId: profile.id,
        },
        {
          name: 'Docker',
          sortOrder: 6,
          profileId: profile.id,
        },
        {
          name: 'PostgreSQL',
          sortOrder: 7,
          profileId: profile.id,
        },
        {
          name: 'MySQL',
          sortOrder: 8,
          profileId: profile.id,
        },
        {
          name: 'SQL',
          sortOrder: 9,
          profileId: profile.id,
        },
        {
          name: 'REST API',
          sortOrder: 10,
          profileId: profile.id,
        },
        {
          name: 'Redux Toolkit',
          sortOrder: 11,
          profileId: profile.id,
        },
        {
          name: 'React Router',
          sortOrder: 12,
          profileId: profile.id,
        },
        {
          name: 'Ant Design',
          sortOrder: 13,
          profileId: profile.id,
        },
        {
          name: 'HTML5',
          sortOrder: 14,
          profileId: profile.id,
        },
        {
          name: 'SCSS/SASS',
          sortOrder: 15,
          profileId: profile.id,
        },
        {
          name: 'PHP',
          sortOrder: 16,
          profileId: profile.id,
        },
        {
          name: 'WordPress',
          sortOrder: 17,
          profileId: profile.id,
        },
      ],
    });

    await tx.experience.createMany({
      data: [
        {
          company: 'FLOXY',
          position: 'Frontend-разработчик',
          startDate: new Date('2025-10-01T00:00:00.000Z'),
          endDate: null,
          current: true,
          achievements: [
            'Разработка внутренних веб-интерфейсов и административных панелей с нуля',
            'Реализация генерации PDF-документов',
            'Интеграция банковского эквайринга',
            'Настройка серверного окружения и Nginx',
            'Разработка Telegram-ботов',
            'Проектирование структуры баз данных для веб-сервисов',
          ],
          sortOrder: 1,
          profileId: profile.id,
        },
        {
          company: 'Skyneex',
          position: 'Frontend-разработчик',
          startDate: new Date('2023-09-01T00:00:00.000Z'),
          endDate: new Date('2025-09-01T00:00:00.000Z'),
          current: false,
          achievements: [
            'Разработка интерактивных интерфейсов для проектов недвижимости и строительства',
            'Реализация схем объектов и помещений, связанных с базой данных',
            'Создание калькуляторов, интерактивных карт, фильтров и анимаций',
            'Оптимизация frontend-логики и скорости работы сайтов',
            'Поддержка и развитие существующих проектов',
          ],
          sortOrder: 2,
          profileId: profile.id,
        },
        {
          company: 'ForestWeb',
          position: 'Frontend-разработчик',
          startDate: new Date('2022-06-01T00:00:00.000Z'),
          endDate: new Date('2023-08-01T00:00:00.000Z'),
          current: false,
          achievements: [
            'Разработка и поддержка клиентских сайтов',
            'Интеграция проектов с CMS MODX',
            'Разработка форм, калькуляторов, анимаций и интерактивных элементов',
            'Доработка существующих проектов и исправление frontend-ошибок',
            'Оптимизация скорости загрузки и стабильности сайтов',
          ],
          sortOrder: 3,
          profileId: profile.id,
        },
      ],
    });

    await tx.project.createMany({
      data: [
        {
          name: 'floxy.pro',
          url: 'https://floxy.pro',
          sortOrder: 1,
          profileId: profile.id,
        },
        {
          name: 'panel.floxy.pro',
          url: 'https://panel.floxy.pro',
          sortOrder: 2,
          profileId: profile.id,
        },
        {
          name: 'forest-web.ru',
          url: 'https://forest-web.ru',
          sortOrder: 3,
          profileId: profile.id,
        },
        {
          name: 'ksi39.ru',
          url: 'https://ksi39.ru',
          sortOrder: 4,
          profileId: profile.id,
        },
        {
          name: 'sal.makrostroy39.ru',
          url: 'https://sal.makrostroy39.ru',
          sortOrder: 5,
          profileId: profile.id,
        },
        {
          name: 'деревушка39.рф',
          url: 'https://деревушка39.рф',
          sortOrder: 6,
          profileId: profile.id,
        },
        {
          name: 'sim.makrostroy39.ru',
          url: 'https://sim.makrostroy39.ru',
          sortOrder: 7,
          profileId: profile.id,
        },
      ],
    });
  });

  console.log('Database seeded successfully');
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed');
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });