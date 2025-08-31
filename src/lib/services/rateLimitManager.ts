// lib/services/rateLimitManager.ts
interface RateLimit {
  count: number;
  resetTime: number;
}

class RateLimitManager {
  private limits: Map<string, RateLimit> = new Map();

  // Rate limits per API per hour
  private readonly API_LIMITS = {
    adzuna: 1000,
    rapidapi: 500,
    openai: 60,
    anthropic: 50,
  };

  public canMakeRequest(apiKey: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(apiKey);

    if (!limit || now > limit.resetTime) {
      // Reset the limit
      this.limits.set(apiKey, {
        count: 1,
        resetTime: now + 60 * 60 * 1000, // 1 hour
      });
      return true;
    }

    const maxRequests =
      this.API_LIMITS[apiKey as keyof typeof this.API_LIMITS] || 100;

    if (limit.count >= maxRequests) {
      return false;
    }

    limit.count++;
    return true;
  }

  public getRemainingRequests(apiKey: string): number {
    const limit = this.limits.get(apiKey);
    if (!limit || Date.now() > limit.resetTime) {
      return this.API_LIMITS[apiKey as keyof typeof this.API_LIMITS] || 100;
    }

    const maxRequests =
      this.API_LIMITS[apiKey as keyof typeof this.API_LIMITS] || 100;
    return Math.max(0, maxRequests - limit.count);
  }
}

export const rateLimitManager = new RateLimitManager();
