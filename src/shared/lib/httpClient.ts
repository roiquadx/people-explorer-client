export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpOptions<TBody = unknown> = {
    method?: HttpMethod;
    body?: TBody;
    headers?: HeadersInit;
};

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}

const DEFAULT_HEADERS: HeadersInit = {
    'Content-Type': 'application/json'
};

async function safeReadMessage(response: Response): Promise<string> {
    try {
        const data = await response.json();
        return data?.message ?? response.statusText;
    } catch {
        return response.statusText;
    }
}

export async function http<TResponse>(url: string, options: HttpOptions = {}): Promise<TResponse> {
    const { method = 'GET', body, headers } = options;

    const response = await fetch(url, {
        method,
        headers: {
            ...DEFAULT_HEADERS,
            ...headers
        },
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const message = await safeReadMessage(response);
        throw new HttpError(response.status, message);
    }

    return response.json() as Promise<TResponse>;
}
