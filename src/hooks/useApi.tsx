import { useState, useCallback } from 'react';

interface RequestOptions {
  [key: string]: any;
}

interface ApiResponse {
  [key: string]: any;
  error?: string;
}

const useApi = () => {
  const makeRequest = useCallback(
    async (url: string, method: string, options?: RequestOptions): Promise<ApiResponse> => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      const fetchOptions: RequestInit = {
        method,
        headers,
        ...options,
      };

      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        if (options?.body) {
          fetchOptions.body = JSON.stringify(options.body);
        }
      }

      try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          if (response.status === 500) {
            return { error: 'Server Error' };
          }
          const errorData = await response.json().catch(() => null);
          return { error: errorData?.message || `Request failed with status ${response.status}` };
        }

        return await response.json();
      } catch (error) {
        return { error: (error as Error).message || 'An unexpected error occurred' };
      }
    },
    []
  );

  const get = useCallback(
    async (url: string, options?: RequestOptions): Promise<ApiResponse> => {
      return makeRequest(url, 'GET', options);
    },
    [makeRequest]
  );

  const post = useCallback(
    async (url: string, options?: RequestOptions): Promise<ApiResponse> => {
      return makeRequest(url, 'POST', options);
    },
    [makeRequest]
  );

  const put = useCallback(
    async (url: string, options?: RequestOptions): Promise<ApiResponse> => {
      return makeRequest(url, 'PUT', options);
    },
    [makeRequest]
  );

  const del = useCallback(
    async (url: string, options?: RequestOptions): Promise<ApiResponse> => {
      return makeRequest(url, 'DELETE', options);
    },
    [makeRequest]
  );

  return { get, post, put, delete: del };
};

export { useApi };