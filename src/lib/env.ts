export default function env(key: string): string {
	if (key in process.env) {
		return process.env[key]!;
	}
	throw new Error(`Key ${key} not found in environment`);
}
