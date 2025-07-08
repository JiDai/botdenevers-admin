import {
	AutocompleteInput,
	BooleanInput,
	Edit,
	required,
	SelectInput,
	SimpleForm,
	TextInput,
	useGetList,
} from 'react-admin';
import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/lib/HttpClient/useHttpClient';
import { useState } from 'react';
import { Box } from '@mui/system';

const TwitchCategoryInput = () => {
	const { client } = useHttpClient();
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading } = useQuery({
		queryKey: ['/api/twitch/search-categories', searchQuery],
		queryFn: () => client.get(`/api/twitch/search-categories?query=${searchQuery}`),
		enabled: !!searchQuery,
		keepPreviousData: true,
	});
	console.log(`data: `, data);

	return (
		<AutocompleteInput
			debounce={200}
			source="twitch_id"
			isPending={isLoading}
			choices={data || []}
			onInputChange={(e) => {
				if (e?.target?.value) {
					setSearchQuery(e.target.value);
				}
			}}
			optionText="name"
			optionValue="id"
		/>
	);
};

const IGDBInput = () => {
	const { client } = useHttpClient();
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading } = useQuery({
		queryKey: ['/api/igdb/search', searchQuery],
		queryFn: () => client.get(`/api/igdb/search?query=${searchQuery}`),
		enabled: !!searchQuery,
		keepPreviousData: true,
	});
	console.log(`data: `, data);

	return (
		<AutocompleteInput
			debounce={200}
			source="igdb_id"
			isPending={isLoading}
			choices={data || []}
			onInputChange={(e) => {
				if (e?.target?.value) {
					setSearchQuery(e.target.value);
				}
			}}
			optionText="name"
			optionValue="id"
		/>
	);
};

export const GameEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="description" label="Description" multiline rows={4} />
				<BooleanInput source="active" label="Active" defaultValue={true} />
				<TextInput source="youtube_url" label="YouTube URL" />
				<TwitchCategoryInput />
				<IGDBInput />
				<SelectInput
					source="status"
					label="Status"
					choices={[
						{ id: 'todo', name: 'Todo' },
						{ id: 'playing', name: 'Playing' },
						{ id: 'finished', name: 'Done' },
						{ id: 'paused', name: 'Paused' },
						{ id: 'abandoned', name: 'Abandoned' },
					]}
					validate={required()}
					defaultValue="todo"
				/>
			</SimpleForm>
		</Edit>
	);
};
