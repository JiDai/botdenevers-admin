export type IGDBGame = {
	id: number;
	cover: {
		alpha_channel: boolean;
		animated: boolean;
		checksum: string;
		game: number;
		height: number;
		id: number;
		image_id: string;
		url: string;
		width: number;
	};
	name: string;
	summary: string;
	url: string;
};
