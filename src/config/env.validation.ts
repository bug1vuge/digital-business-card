type NodeEnvironment = 'development' | 'test' | 'production';

interface EnvironmentVariables {
  DATABASE_URL: string;
  PORT: string;
  NODE_ENV: NodeEnvironment;
}

const NODE_ENVIRONMENTS: NodeEnvironment[] = [
  'development',
  'test',
  'production',
];

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const databaseUrl = String(config.DATABASE_URL ?? '').trim();
  const port = String(config.PORT ?? '3000').trim();
  const nodeEnv = String(
    config.NODE_ENV ?? 'development',
  ).trim() as NodeEnvironment;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  if (!databaseUrl.startsWith('postgresql://')) {
    throw new Error(
      'DATABASE_URL must use the postgresql:// protocol',
    );
  }

  const parsedPort = Number(port);

  if (
    !Number.isInteger(parsedPort) ||
    parsedPort < 1 ||
    parsedPort > 65535
  ) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  if (!NODE_ENVIRONMENTS.includes(nodeEnv)) {
    throw new Error(
      `NODE_ENV must be one of: ${NODE_ENVIRONMENTS.join(', ')}`,
    );
  }

  return {
    DATABASE_URL: databaseUrl,
    PORT: port,
    NODE_ENV: nodeEnv,
  };
}