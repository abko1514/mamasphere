// lib/services/apiKeyManager.ts
export class APIKeyManager {
  private static instance: APIKeyManager;

  private constructor() {}

  public static getInstance(): APIKeyManager {
    if (!APIKeyManager.instance) {
      APIKeyManager.instance = new APIKeyManager();
    }
    return APIKeyManager.instance;
  }

  public validateKeys(): { isValid: boolean; missing: string[] } {
    const requiredKeys = [
      "ADZUNA_APP_ID",
      "ADZUNA_API_KEY",
      "RAPIDAPI_KEY",
      "OPENAI_API_KEY",
      "MONGODB_URI",
    ];

    const missing = requiredKeys.filter((key) => !process.env[key]);

    return {
      isValid: missing.length === 0,
      missing,
    };
  }

  public getFailsafeConfig() {
    const { isValid, missing } = this.validateKeys();

    if (!isValid) {
      console.warn(
        `Missing API keys: ${missing.join(", ")}. Using fallback mode.`
      );
    }

    return {
      useRealData: isValid,
      availableServices: {
        jobs: !!process.env.ADZUNA_API_KEY || !!process.env.RAPIDAPI_KEY,
        freelance: !!process.env.RAPIDAPI_KEY,
        ai: !!process.env.OPENAI_API_KEY || !!process.env.ANTHROPIC_API_KEY,
        businesses:
          !!process.env.YELP_API_KEY || !!process.env.GOOGLE_PLACES_API_KEY,
      },
    };
  }
}
