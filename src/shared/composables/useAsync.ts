import { ref } from 'vue';

export function useAsync<T, Args extends unknown[] = []>(fn: (...args: Args) => Promise<T>) {
    const data = ref<T | null>(null);
    const error = ref<Error | null>(null);
    const loading = ref(false);

    const execute = async (...args: Args): Promise<T> => {
        loading.value = true;
        error.value = null;

        try {
            const result = await fn(...args);
            data.value = result;
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        error,
        loading,
        execute
    };
}
