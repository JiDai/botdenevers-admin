// in src/posts.js
import {
	Edit,
	SimpleForm,
	TextInput,
	SelectInput,
	BooleanInput,
	FileInput,
	Button,
	required,
	useFieldValue
} from 'react-admin';
import { useRef } from 'react';

const AudioPlayer = (props) => {
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
				<Button type="button" onClick={playAudio}>
					Play {value.split('/').pop()}
				</Button>
			</div>
		)
	);
};

export const CommandEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput label="Name" source="name" validate={required()} />
			<TextInput label="Message" source="message" />
			<BooleanInput label="Active" source="active" />
			<BooleanInput label="Module" source="module" />
			<TextInput label="Permission" source="permission" />
			<SelectInput label="Type" source="type" choices={['chat', 'sound_alert', 'visual_alert']} />
			<FileInput label="Media file" source="file_url" accept={{ 'audio/*': ['.mp3', '.wav'] }} />
			<AudioPlayer source="file_url" title="title" />
		</SimpleForm>
	</Edit>
);
