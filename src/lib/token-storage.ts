/**
 * SecureTokenStorage - Secure token management for JWT authentication
 * Provides secure storage and retrieval of access and refresh tokens
 */

export class SecureTokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'medgenie_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'medgenie_refresh_token';

  /**
   * Store access and refresh tokens securely
   * @param accessToken - JWT access token
   * @param refreshToken - JWT refresh token
   */
  static setTokens(accessToken: string, refreshToken: string): void {
    try {
      // Store access token in sessionStorage (cleared when tab closes)
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      
      // Store refresh token in httpOnly cookie (handled by backend)
      // The refresh token is managed by the backend via httpOnly cookies
      // We just store the access token locally for API calls
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Store only access token (for refresh scenarios)
   * @param accessToken - JWT access token
   */
  static setAccessToken(accessToken: string): void {
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    } catch (error) {
      console.error('Error storing access token:', error);
      throw new Error('Failed to store access token');
    }
  }

  /**
   * Retrieve access token from secure storage
   * @returns Access token or null if not found
   */
  static getAccessToken(): string | null {
    try {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Check if access token exists
   * @returns True if access token exists
   */
  static hasAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Clear all stored tokens
   */
  static clearTokens(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Clear only access token
   */
  static clearAccessToken(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing access token:', error);
    }
  }

  /**
   * Get token expiration time
   * @returns Expiration timestamp in milliseconds or null if invalid
   */
  static getTokenExpiration(): number | null {
    try {
      const token = this.getAccessToken();
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Error parsing token expiration:', error);
      return null;
    }
  }

  /**
   * Check if access token is expired
   * @returns True if token is expired or invalid
   */
  static isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    
    return Date.now() >= expiration;
  }

  /**
   * Get time until token expires
   * @returns Time in milliseconds until expiration, or 0 if expired
   */
  static getTimeUntilExpiration(): number {
    const expiration = this.getTokenExpiration();
    if (!expiration) return 0;
    
    const timeLeft = expiration - Date.now();
    return Math.max(0, timeLeft);
  }
}

// Export default instance for convenience
export default SecureTokenStorage;
