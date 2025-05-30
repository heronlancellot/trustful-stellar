/**
 * HTTP Layer - Next.js 15 App Router
 * Modern fetch-based architecture with Server Actions and Route Handlers
 */

// Modern Server Actions (recommended approach)
export * from '../actions/communities';
export * from '../actions/users';
export * from '../actions/assets';
export * from '../actions/community';

// Types and Adapters (for data transformation)
export { userBadgeAdapter } from './adapters/UserAdapters';
export { communityBadgeAdapter } from './adapters/CommunityAdapters';
export type { UserBadgeFromApi } from './adapters/UserAdapters';
export type { CommunityBadgeFromApi } from './adapters/CommunityAdapters';

// Utility Functions for Direct Fetch (when server actions aren't suitable)
export const createAPIFetch = (baseUrl?: string) => {
  const apiUrl =
    baseUrl ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL_INTERNAL;

  if (!apiUrl) {
    throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL.');
  }

  return {
    async get<T>(path: string, params?: Record<string, string>): Promise<T> {
      const url = new URL(`${apiUrl}/${path}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },

    async post<T>(path: string, body: any): Promise<T> {
      const response = await fetch(`${apiUrl}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
  };
};
