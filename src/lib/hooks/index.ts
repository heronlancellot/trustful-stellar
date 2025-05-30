/**
 * Modern React Query Hooks - Next.js 15 App Router
 * Centralized exports for all API hooks
 */

// Communities API hooks
export * from './api/useCommunities';

// Users API hooks
export * from './api/useUsers';

// You can add more hook categories here as needed
// Example:
// export * from './api/useAssets';
// export * from './api/useAuth';
// export * from './ui/useModal';
// export * from './ui/useNotifications';

// Re-export React Query utilities for convenience
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
