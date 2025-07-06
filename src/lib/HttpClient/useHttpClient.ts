import { HttpClient } from '@/lib/HttpClient/HttpClient';

export const useHttpClient = () => {
	const client = HttpClient.getInstance(`${document.location.protocol}//${document.location.host}`);

	return { client };
};
