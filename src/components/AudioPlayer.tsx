import { useRef } from 'react';
import { Button, useFieldValue } from 'react-admin';

type AudioPlayerProps = {
	source: string;
	title: string;
};

export const AudioPlayer = (props: AudioPlayerProps) => {
	const value = useFieldValue(props);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playAudio = () => {
		if (audioRef.current) {
			audioRef.current.play();
		}
	};

	// During edition value is a File object, after saved, this is an URL
	const savedValue = typeof value === 'string' ? value : '';
	return (
		savedValue && (
			<div>
				<audio ref={audioRef} src={savedValue} />
				<Button type="button" onClick={playAudio}>
					Play {value.split('/').pop()}
				</Button>
			</div>
		)
	);
};
