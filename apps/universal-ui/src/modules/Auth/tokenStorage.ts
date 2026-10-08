import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';

// In-memory token cache for synchronous access
let tokenCache: string | null = null;

/**
 * Get auth token (synchronous for use in headers)
 * Returns cached token if available
 */
export const getAuthToken = (): string | null => {
    return tokenCache;
};

/**
 * Set auth token in storage and cache
 */
export const setAuthToken = async (token: string): Promise<void> => {
    tokenCache = token;
    if (Platform.OS === 'web') {
        // Use localStorage on web
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
    } else {
        // Use SecureStore on native
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    }
};

/**
 * Clear auth token from storage and cache
 */
export const clearAuthToken = async (): Promise<void> => {
    tokenCache = null;
    if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    } else {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    }
};

/**
 * Get auth token from storage (async version)
 * Use this when you need to check storage directly
 */
export const getAuthTokenAsync = async (): Promise<string | null> => {
    try {
        if (Platform.OS === 'web') {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(AUTH_TOKEN_KEY);
            }
        } else {
            return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        }
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
    }
    return null;
};

/**
 * Load token from storage into cache (call on app start)
 */
export const loadAuthToken = async (): Promise<void> => {
    try {
        if (Platform.OS === 'web') {
            if (typeof localStorage !== 'undefined') {
                tokenCache = localStorage.getItem(AUTH_TOKEN_KEY);
            }
        } else {
            tokenCache = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        }
    } catch (error) {
        console.error('Failed to load auth token:', error);
        tokenCache = null;
    }
};
