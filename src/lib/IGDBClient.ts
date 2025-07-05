interface Token {
	access_token: string;
	refresh_token?: string;
}

interface ResponseError {
	status: number;
	message: string;
}

interface RequestOptions {
	target: object;
	endpoint: string;
	method: 'GET' | 'POST';
	params?: Record<string, string>;
	body?: string;
}

class IGDBClient {
	private twitchApiTokenUrl: string;
	private clientId: string;
	private clientSecret: string;
	private twitchApiRefreshToken: string;
	private token: Token;

	constructor(twitchApiTokenUrl: string, clientId: string, clientSecret: string, twitchApiRefreshToken: string) {
		this.twitchApiTokenUrl = twitchApiTokenUrl;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.twitchApiRefreshToken = twitchApiRefreshToken;
		this.token = { access_token: '' };
	}

	async AuthByClientCredentials(): Promise<void> {
		try {
			const requestUrl = new URL('token', this.twitchApiTokenUrl).toString();

			const response = await fetch(requestUrl, {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: new URLSearchParams({
					client_id: this.clientId,
					client_secret: this.clientSecret,
					grant_type: 'client_credentials',
					refresh_token: this.twitchApiRefreshToken
				})
			});

			if (!response.ok) {
				console.log(`HTTP Error: ${response.status} ${response.statusText}`);
				this.token.access_token = '';
				return;
			}

			this.token = (await response.json()) as Token;
		} catch (error) {
			console.log('Unable to authenticate:', error);
			this.token.access_token = '';
		}
	}

	async Get(options: RequestOptions): Promise<void> {
		await this.AuthByClientCredentials();

		if (!this.token.access_token) {
			throw new Error('Unable to get token.');
		}

		const requestUrl = new URL(options.endpoint, this.twitchApiTokenUrl).toString();

		try {
			const response = await fetch(requestUrl, {
				method: options.method,
				headers: {
					'client-id': this.clientId,
					Authorization: `Bearer ${this.token.access_token}`,
					'Content-type': 'text/plain'
				},
				body: options.body
			});

			if (!response.ok) {
				const error = (await response.json()) as ResponseError;
				throw new Error(`HTTP Error ${error.status} for endpoint ${options.endpoint}: ${error.message}`);
			}

			const result = await response.json();
			Object.assign(options.target, result);
		} catch (error) {
			throw new Error(`Unable to process request for endpoint ${options.endpoint}: ${error}`);
		}
	}
}

export { IGDBClient };
