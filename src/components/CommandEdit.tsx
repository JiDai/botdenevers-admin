import { useState } from 'react';
import {
	BooleanInput,
	Edit,
	FileInput,
	required,
	SelectInput,
	SimpleForm,
	TextInput,
	useCreate,
	useGetManyReference,
	useRecordContext,
	useUpdate,
} from 'react-admin';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { AudioPlayer } from './AudioPlayer';

const CommandLabelsEditor = () => {
	const record = useRecordContext();
	const { data: labels = [], refetch } = useGetManyReference('command_label', {
		target: 'command_id',
		id: record?.id,
	});
	const [update] = useUpdate();
	const [create] = useCreate();
	const [values, setValues] = useState<Record<number, string>>({});
	const [newLabel, setNewLabel] = useState({ language: '', label: '' });

	if (record?.parent_id !== null) return null;

	const getValue = (label: { id: number; label: string }) =>
		values[label.id] !== undefined ? values[label.id] : label.label;

	const handleSave = (label: { id: number; label: string }) => {
		update('command_label', { id: label.id, data: { label: getValue(label) }, previousData: label });
	};

	const handleCreate = () => {
		if (!newLabel.language || !newLabel.label) return;
		create(
			'command_label',
			{
				data: { command_id: record.id, language: newLabel.language, label: newLabel.label },
			},
			{
				onSuccess: () => {
					setNewLabel({ language: '', label: '' });
					refetch();
				},
			},
		);
	};

	return (
		<Stack gap={1} width="100%">
			<Typography variant="caption">Labels</Typography>
			{labels.map((label: { id: number; label: string; language: string }) => {
				console.log(`label: `, label);
				return (
					<Stack key={label.id} direction="row" alignItems="center" gap={1}>
						<Typography width={80} variant="body2" color="text.secondary">
							{label.language}
						</Typography>
						<TextField
							size="small"
							value={getValue(label)}
							onChange={(e) => setValues((v) => ({ ...v, [label.id]: e.target.value }))}
						/>
						<IconButton size="small" onClick={() => handleSave(label)}>
							<SaveIcon fontSize="small" />
						</IconButton>
					</Stack>
				);
			})}
			<Stack direction="row" alignItems="center" gap={1} mt={1}>
				<TextField
					size="small"
					placeholder="langue (ex: fr)"
					value={newLabel.language}
					onChange={(e) => setNewLabel((v) => ({ ...v, language: e.target.value }))}
					sx={{ width: 80 }}
				/>
				<TextField
					size="small"
					placeholder="label"
					value={newLabel.label}
					onChange={(e) => setNewLabel((v) => ({ ...v, label: e.target.value }))}
				/>
				<IconButton size="small" onClick={handleCreate}>
					<SaveIcon fontSize="small" />
				</IconButton>
			</Stack>
		</Stack>
	);
};

export const CommandEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput label="Name" source="name" validate={required()} />
				<CommandLabelsEditor />
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
