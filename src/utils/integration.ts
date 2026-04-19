export class IntegrationConfigError extends Error {
  readonly missingVars: string[];
  readonly integration: string;

  constructor(integration: string, missingVars: string[]) {
    super(`Missing required ${integration} environment variables: ${missingVars.join(', ')}`);
    this.integration = integration;
    this.missingVars = missingVars;
  }
}

export const getMissingVars = (keys: string[]): string[] =>
  keys.filter((key) => !process.env[key] || process.env[key]?.trim() === '');
