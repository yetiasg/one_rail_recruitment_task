import dotenv from "dotenv";
import type { ObjectSchema } from "joi";

type Settings = Record<string, unknown>;

type RegisterOptions<T extends Settings> = {
  schema: ObjectSchema<T>;
  envFilePath?: string;
  allowUnknown?: boolean;
  abortEarly?: boolean;
};

function normalizeStrings(settings: Settings): Settings {
  const normalized: Settings = { ...settings };
  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === "string")
      normalized[key] = value.trim().replace(/^['"]|['"]$/g, "");
  }
  return normalized;
}

export class Config {
  private static initialized = false;
  private static settings: Readonly<Settings>;

  static register<T extends Settings>(options: RegisterOptions<T>): void {
    dotenv.config({ quiet: true, path: options.envFilePath });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, value } = options.schema.validate(process.env, {
      abortEarly: options.abortEarly ?? false,
      convert: true,
      allowUnknown: options.allowUnknown ?? false,
    });

    if (error) {
      const details = error.details.map((d) => d.message).join("; ");
      throw new Error(`Invalid ENV: ${details}`);
    }

    Config.settings = Object.freeze(normalizeStrings(value as Settings));
    Config.initialized = true;
  }

  static get<S extends Settings, T extends S[K], K extends keyof S = keyof S>(
    key: K,
  ) {
    if (!Config.initialized)
      throw new Error(
        "Config not initialized. Call Config.register({ schema }) in main.ts first.",
      );

    const value = Config.settings[key as string];
    if (value === undefined)
      throw new Error(`Missing config key: ${String(key)}`);

    return value as T;
  }
}
