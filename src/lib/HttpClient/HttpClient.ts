type RequestOptions = {
	headers?: Record<string, string>;
	params?: Record<string, string>;
};

export class HttpClient {
	private static instance: HttpClient;
	private readonly baseURL: string;

	private constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	public static getInstance(baseURL: string): HttpClient {
		if (!HttpClient.instance) {
			HttpClient.instance = new HttpClient(baseURL);
		}
		return HttpClient.instance;
	}

	private async request<T>(path: string, method: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
		const url = new URL(path, this.baseURL);
		if (options.params) {
			Object.entries(options.params).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	async get<T>(path: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(path, 'GET', undefined, options);
	}

	async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>(path, 'POST', body, options);
	}

	async put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>(path, 'PUT', body, options);
	}

	async delete<T>(path: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(path, 'DELETE', undefined, options);
	}
}
