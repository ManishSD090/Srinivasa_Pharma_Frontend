import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for API calls with loading, error handling, and cleanup
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Configuration options
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (apiFunction, dependencies = [], options = {}) => {
    const {
        immediate = true,
        onSuccess = null,
        onError = null,
        initialData = null
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef(null);

    const execute = useCallback(async (...args) => {
        try {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            const result = await apiFunction(...args, {
                signal: abortControllerRef.current.signal
            });

            if (isMountedRef.current) {
                setData(result);
                setLoading(false);
                if (onSuccess) onSuccess(result);
            }

            return result;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }

            if (isMountedRef.current) {
                setError(err);
                setLoading(false);
                if (onError) onError(err);
            }

            throw err;
        }
    }, [apiFunction, onSuccess, onError]);

    useEffect(() => {
        if (immediate) {
            execute();
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, dependencies);

    const refetch = useCallback(() => {
        return execute();
    }, [execute]);

    return { data, loading, error, refetch, execute };
};

/**
 * Custom hook for polling API with automatic cleanup
 * @param {Function} apiFunction - The API function to call
 * @param {number} interval - Polling interval in milliseconds
 * @param {Array} dependencies - Dependencies array
 * @param {Object} options - Configuration options
 * @returns {Object} { data, loading, error, stopPolling, startPolling }
 */
export const usePolling = (apiFunction, interval, dependencies = [], options = {}) => {
    const {
        immediate = true,
        enabled = true,
        onSuccess = null,
        onError = null
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPolling, setIsPolling] = useState(enabled);
    const intervalRef = useRef(null);
    const isMountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await apiFunction();

            if (isMountedRef.current) {
                setData(result);
                setLoading(false);
                if (onSuccess) onSuccess(result);
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError(err);
                setLoading(false);
                if (onError) onError(err);
            }
        }
    }, [apiFunction, onSuccess, onError]);

    const startPolling = useCallback(() => {
        setIsPolling(true);
    }, []);

    const stopPolling = useCallback(() => {
        setIsPolling(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isPolling && enabled) {
            if (immediate) {
                fetchData();
            }

            intervalRef.current = setInterval(fetchData, interval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPolling, enabled, interval, fetchData, immediate, ...dependencies]);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { data, loading, error, stopPolling, startPolling, isPolling };
};

/**
 * Custom hook for debounced API calls
 * @param {Function} apiFunction - The API function to call
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} { data, loading, error, debouncedCall }
 */
export const useDebouncedApi = (apiFunction, delay = 500) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const timeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    const debouncedCall = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setLoading(true);

        timeoutRef.current = setTimeout(async () => {
            try {
                const result = await apiFunction(...args);

                if (isMountedRef.current) {
                    setData(result);
                    setError(null);
                    setLoading(false);
                }
            } catch (err) {
                if (isMountedRef.current) {
                    setError(err);
                    setLoading(false);
                }
            }
        }, delay);
    }, [apiFunction, delay]);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { data, loading, error, debouncedCall };
};

export default useApi;
