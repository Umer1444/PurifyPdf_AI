// Firebase security utilities and helpers
import { User } from "firebase/auth";

/**
 * Validates if a user is authenticated
 */
export const isAuthenticated = (user: User | null): user is User => {
  return user !== null && user.uid !== undefined;
};

/**
 * Validates user email domain (optional security measure)
 */
export const isValidEmailDomain = (
  email: string,
  allowedDomains?: string[]
): boolean => {
  if (!allowedDomains || allowedDomains.length === 0) return true;

  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
};

/**
 * Sanitizes user display name to prevent XSS
 */
export const sanitizeDisplayName = (displayName: string | null): string => {
  if (!displayName) return "Anonymous User";

  // Remove HTML tags and limit length
  return displayName
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 50);
};

/**
 * Validates Firebase ID token format
 */
export const isValidIdToken = (token: string): boolean => {
  // Basic JWT format validation (header.payload.signature)
  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

/**
 * Rate limiting helper for auth operations
 */
class AuthRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(
      (time) => now - time < this.windowMs
    );

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const authRateLimiter = new AuthRateLimiter();
