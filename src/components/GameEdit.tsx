// in src/posts.js
import { AutocompleteInput, BooleanInput, Edit, required, SelectInput, TextInput } from 'react-admin';

export const GameEdit = () => {
	return (
		<Edit>
			<TextInput source="igdb_id" label="IGDB ID" />
			<TextInput source="description" label="Description" multiline rows={4} />
			<BooleanInput source="active" label="Active" defaultValue={true} />
			<TextInput source="youtube_url" label="YouTube URL" />
			<TextInput source="twitch_id" label="Twitch ID" />
			<AutocompleteInput
				source="twitch_id"
				choices={[
					{ id: 'tech', name: 'Tech' },
					{ id: 'lifestyle', name: 'Lifestyle' },
					{ id: 'people', name: 'People' }
				]}
			/>
			<SelectInput
				source="status"
				label="Status"
				choices={[
					{ id: 'todo', name: 'Todo' },
					{ id: 'in_progress', name: 'In Progress' },
					{ id: 'done', name: 'Done' }
				]}
				validate={required()}
				defaultValue="todo"
			/>
		</Edit>
	);
};
