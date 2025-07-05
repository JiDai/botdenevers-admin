// in src/posts.js
import {
	BooleanInput,
	Button,
	Edit,
	FileInput,
	ReferenceManyField,
	required,
	SelectInput,
	SimpleForm,
	TextInput,
	useFieldValue,
	WithRecord
} from 'react-admin';
import { useRef } from 'react';

type AudioPlayerProps = {
	source: string;
	title: string;
};

const AudioPlayer = (props: AudioPlayerProps) => {
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

export const CommandEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput label="Name" source="name" validate={required()} />
				<ReferenceManyField reference="command_label" target="command_id">
					<WithRecord
						render={(record) => (
							<SimpleForm>
								<TextInput source="label" label={`Label ${record.language}`} />
							</SimpleForm>
						)}
					/>
				</ReferenceManyField>
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
};
